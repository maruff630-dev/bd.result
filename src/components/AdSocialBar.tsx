'use client';

import { useEffect, useRef } from 'react';

export default function AdSocialBar() {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent strict mode double-injection
    if (initialized.current) return;
    initialized.current = true;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl29324434.profitablecpmratenetwork.com/0f/76/1f/0f761f01e70b180729134eb06428a00b.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Optional cleanup if you want to remove it when component unmounts.
      // Usually ad scripts inject elements into body that might be hard to clean up, 
      // but we can try to remove the script tag itself.
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
}
