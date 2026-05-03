'use client';

export default function AdBanner({ dataKey, width, height, className = "" }: { dataKey: string, width: number, height: number, className?: string }) {
  // Using srcDoc with an iframe is the safest way to render Adsterra's invoke.js in a React application.
  // It prevents document.write() from destroying the React DOM.
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${dataKey}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/${dataKey}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`flex justify-center items-center w-full ${className}`} style={{ minHeight: height }}>
      <iframe 
        srcDoc={html} 
        width={width} 
        height={height} 
        frameBorder="0" 
        scrolling="no"
        className="max-w-full bg-transparent"
        style={{ border: 'none', overflow: 'hidden' }}
      ></iframe>
    </div>
  );
}
