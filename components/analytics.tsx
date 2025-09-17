'use client';

import { useEffect } from 'react';

export function Analytics() {
  useEffect(() => {
    // Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', 'G-CSRTEPL9GN');

    // Google Tag Manager
    (function(w: any, d: any, s: any, l: any, i: any) {
      w[l] = w[l] || [];
      w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
      var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-TJBS3J62');
  }, []);

  return null;
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}