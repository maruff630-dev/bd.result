'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, CheckCircle, GraduationCap } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import AdBanner from '@/components/AdBanner';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [resultData, setResultData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResult = async () => {
      const roll = searchParams.get('roll');
      const board = searchParams.get('board');
      const exam = searchParams.get('exam');
      const year = searchParams.get('year');
      const reg = searchParams.get('reg');

      if (!roll || !board || !exam || !year || !reg) {
        setError("Invalid search parameters");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roll, board, exam, year, reg }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to fetch result");
        }

        const data = await response.json();
        setResultData(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [searchParams]);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);
    
    // Save original viewport and force desktop width so the PDF always looks like the Desktop version
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const originalViewport = viewportMeta?.getAttribute('content') || '';
    viewportMeta?.setAttribute('content', 'width=1024');

    // Wait a brief moment for React to re-render, remove rounded corners, and browser to apply desktop media queries
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const element = pdfRef.current;
      // html-to-image perfectly supports Tailwind's modern oklch/lab colors!
      const imgData = await toPng(element, {
        quality: 1.0,
        pixelRatio: 4, // 4K quality scale
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions maintaining aspect ratio based on the element's actual layout
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const rect = element.getBoundingClientRect();
      const pdfHeight = (rect.height * pdfWidth) / rect.width;
      
      // If the content is longer than one A4 page, it will overflow or we can scale it to fit one page perfectly.
      // Usually a marksheet fits in one page. We will scale it to fit the page height if it's too long, but keeping aspect ratio.
      const pageHeight = pdf.internal.pageSize.getHeight();
      let finalHeight = pdfHeight;
      let finalWidth = pdfWidth;
      
      if (pdfHeight > pageHeight) {
        finalHeight = pageHeight;
        finalWidth = (rect.width * pageHeight) / rect.height;
      }

      // Center the image horizontally if it was scaled down by height
      const xOffset = (pdfWidth - finalWidth) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, 0, finalWidth, finalHeight);
      pdf.save(`${resultData.roll}_${resultData.exam}_${resultData.year}_Marksheet.pdf`);

    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      // Restore the original viewport for mobile users
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta && originalViewport) {
        viewportMeta.setAttribute('content', originalViewport);
      }
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Fetching Result...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 p-8 rounded-2xl max-w-md text-center shadow-lg shadow-red-500/5">
          <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-6">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 px-6 py-2.5 rounded-xl transition-all shadow-md font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 py-2.5 px-6 rounded-xl transition-all font-medium shadow-sm"
          >
            <ArrowLeft size={18} /> Search Again
          </button>
          
          {/* Download Button moved outside the PDF capture area */}
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 text-white font-semibold py-2.5 px-6 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:scale-100 w-full sm:w-auto"
          >
            {isDownloading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <Download size={18} />
            )}
            {isDownloading ? 'Downloading...' : 'Download Marksheet'}
          </button>
        </div>

        {/* This div is what gets converted to PDF */}
        <div 
          ref={pdfRef} 
          className={`bg-white dark:bg-slate-900 overflow-hidden ${isDownloading ? '' : 'rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800'}`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 text-white/10 hidden sm:block">
              <GraduationCap size={200} />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
              <div className="w-full">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm mb-4 inline-block uppercase">
                  {resultData.exam} - {resultData.year}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight break-words">{resultData.name}</h1>
                <div className="text-blue-100 mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm sm:text-base">
                  <span>Roll: <strong className="text-white">{resultData.roll}</strong></span>
                  <span>Board: <strong className="capitalize text-white">{resultData.board.toLowerCase()}</strong></span>
                </div>
              </div>
              <div className="sm:text-right bg-white/10 sm:bg-transparent p-4 sm:p-0 rounded-xl w-full sm:w-auto backdrop-blur-sm sm:backdrop-blur-none border border-white/10 sm:border-none">
                <p className="text-blue-100 text-xs sm:text-sm font-medium uppercase tracking-wider mb-1">Result Status</p>
                <div className="flex items-center sm:justify-end gap-2">
                  <CheckCircle className="text-emerald-300" size={24} />
                  <span className="text-2xl font-bold tracking-tight text-white">{resultData.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-10">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <h3 className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Student Details</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-200 dark:border-slate-700 pb-3 gap-1">
                    <span className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">Father's Name</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base break-words">{resultData.fatherName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-200 dark:border-slate-700 pb-3 gap-1">
                    <span className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">Mother's Name</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base break-words">{resultData.motherName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between pb-1 gap-1">
                    <span className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">Registration</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base break-words">{resultData.reg}</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 flex flex-col justify-center items-center text-center">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-sm mb-2">Final GPA</span>
                <span className="text-4xl font-black text-emerald-500 dark:text-emerald-400">{resultData.gpa}</span>
                <span className="mt-3 text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-100 dark:bg-emerald-900/50 px-4 py-1.5 rounded-full text-sm border border-emerald-200/50 dark:border-emerald-800/50">
                  Group: {resultData.group}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 px-1 sm:px-0">
                Subject-wise Grades
              </h3>
              <div className={`${isDownloading ? 'overflow-hidden' : 'overflow-x-auto'} border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-sm`}>
                <table className="w-full text-left border-collapse min-w-[300px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-wider">
                      <th className="p-3 sm:p-4 font-semibold border-b border-slate-200 dark:border-slate-700/50">Subject</th>
                      <th className="p-3 sm:p-4 font-semibold border-b border-slate-200 dark:border-slate-700/50 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {resultData.subjects.map((sub: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 sm:p-4 text-slate-800 dark:text-slate-300 font-medium text-xs sm:text-base leading-snug">{sub.name}</td>
                        <td className="p-3 sm:p-4 text-right">
                          <span className={`px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold inline-block border ${
                            sub.grade.includes('A') ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' :
                            sub.grade.includes('B') ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50' :
                            sub.grade.includes('C') ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50' :
                            'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}>
                            {sub.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 300x250 Medium Rectangle Ad */}
            <div className="mt-8 flex justify-center w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30">
              <AdBanner dataKey="487afd950c6b1c33f42978d454b5eb11" width={300} height={250} className="py-2" />
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
