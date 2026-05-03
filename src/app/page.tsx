'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Calendar, GraduationCap, MapPin, ChevronDown, CheckCircle2, Award } from 'lucide-react';

// Custom Select Component for Premium UI
function CustomSelect({ name, label, icon: Icon, options, value, onChange, placeholder }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o: any) => o.value === value);

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Icon size={16} className="text-blue-500 dark:text-blue-400"/> {label}
      </label>
      <div className="relative">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white dark:bg-slate-800 border ${isOpen ? 'border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-400/20' : 'border-slate-200 dark:border-slate-700'} rounded-2xl px-4 py-3.5 flex justify-between items-center cursor-pointer transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-600`}
        >
          <span className={selectedOption ? "text-slate-800 dark:text-slate-200 font-medium" : "text-slate-400 dark:text-slate-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown size={18} className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500 dark:text-blue-400' : ''}`} />
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
                  {options.map((opt: any) => (
                    <div
                      key={opt.value}
                      onClick={() => {
                        onChange({ target: { name, value: opt.value } });
                        setIsOpen(false);
                      }}
                      className={`px-4 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all ${
                        value === opt.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    exam: '',
    year: '',
    board: '',
    roll: '',
    reg: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.exam || !formData.year || !formData.board) {
      alert("অনুগ্রহ করে পরীক্ষার নাম, বছর এবং বোর্ড নির্বাচন করুন।");
      return;
    }
    setIsLoading(true);
    const params = new URLSearchParams(formData);
    router.push(`/result?${params.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string, value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const years = Array.from({ length: 17 }, (_, i) => 2026 - i).map(y => ({ value: String(y), label: String(y) }));
  
  const examOptions = [
    { value: 'ssc', label: 'SSC / Dakhil / Equivalent' },
    { value: 'hsc', label: 'HSC / Alim / Equivalent' },
    { value: 'jsc', label: 'JSC / JDC' }
  ];

  const boardOptions = [
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'rajshahi', label: 'Rajshahi' },
    { value: 'comilla', label: 'Comilla' },
    { value: 'jessore', label: 'Jessore' },
    { value: 'chittagong', label: 'Chittagong' },
    { value: 'barisal', label: 'Barisal' },
    { value: 'sylhet', label: 'Sylhet' },
    { value: 'dinajpur', label: 'Dinajpur' },
    { value: 'mymensingh', label: 'Mymensingh' },
    { value: 'madrasha', label: 'Madrasha' },
    { value: 'technical', label: 'Technical' },
    { value: 'dibs', label: 'DIBS(Dhaka)' }
  ];

  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden relative selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-50 dark:opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-500/20 blur-[100px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 dark:bg-emerald-500/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-400/10 dark:bg-indigo-500/10 blur-[150px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Branding & Bangla Text (Visible on all screens) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col space-y-6 lg:space-y-8 text-center lg:text-left items-center lg:items-start"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm mb-4 lg:mb-6 border border-blue-200 dark:border-blue-800/50">
              <Award size={16} className="sm:w-[18px] sm:h-[18px]" />
              অফিসিয়াল রেজাল্ট পোর্টাল
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4 lg:mb-6 tracking-tight">
              বাংলাদেশ এডুকেশন <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">বোর্ড রেজাল্ট</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
              আপনার এসএসসি, এইচএসসি এবং জেএসসি পরীক্ষার ফলাফল জানুন দ্রুত, নির্ভুল এবং সম্পূর্ণ বিনামূল্যে। 
            </p>
          </div>

          <div className="space-y-3 lg:space-y-4 w-full max-w-sm sm:max-w-md mx-auto lg:mx-0 text-left">
            <div className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium bg-white/50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl border border-white dark:border-slate-700 shadow-sm lg:shadow-none backdrop-blur-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <p>১০০% নির্ভুল এবং দ্রুত ফলাফল</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium bg-white/50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl border border-white dark:border-slate-700 shadow-sm lg:shadow-none backdrop-blur-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Search size={18} />
              </div>
              <p>এক ক্লিকেই মার্কশিট ডাউনলোড</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white dark:border-slate-800 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]">

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <CustomSelect 
                name="exam" 
                label="Examination" 
                icon={BookOpen} 
                options={examOptions} 
                value={formData.exam} 
                onChange={handleChange} 
                placeholder="Select Examination"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CustomSelect 
                  name="year" 
                  label="Year" 
                  icon={Calendar} 
                  options={years} 
                  value={formData.year} 
                  onChange={handleChange} 
                  placeholder="Select Year"
                />

                <CustomSelect 
                  name="board" 
                  label="Board" 
                  icon={MapPin} 
                  options={boardOptions} 
                  value={formData.board} 
                  onChange={handleChange} 
                  placeholder="Select Board"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Roll */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full border-[3px] border-blue-500"/> Roll Number
                  </label>
                  <input 
                    required
                    type="number"
                    name="roll"
                    placeholder="e.g. 123456"
                    value={formData.roll}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium shadow-sm hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>

                {/* Reg */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[3px] border-[3px] border-blue-500"/> Reg Number
                  </label>
                  <input 
                    required
                    type="number"
                    name="reg"
                    placeholder="e.g. 1234567890"
                    value={formData.reg}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium shadow-sm hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                type="submit"
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:scale-100 border border-blue-500"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={20} />
                    Get Result
                  </>
                )}
              </motion.button>
              
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
