'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function ToolHeaderAd() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="w-full py-4 bg-muted/10 border-y">
      <div className="container mx-auto px-4 flex justify-center">
        <ins className="adsbygoogle"
             style={{display:'block'}}
             data-ad-client="ca-pub-6246142348671168"
             data-ad-slot="7890123456"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
}

export function ToolSidebarAd() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="w-full mb-6">
      <ins className="adsbygoogle"
           style={{display:'block'}}
           data-ad-client="ca-pub-6246142348671168"
           data-ad-slot="8901234567"
           data-ad-format="rectangle"
           data-full-width-responsive="true"></ins>
    </div>
  );
}

export function ToolFooterAd() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="w-full py-4 bg-muted/10 border-t mt-8">
      <div className="container mx-auto px-4 flex justify-center">
        <ins className="adsbygoogle"
             style={{display:'block'}}
             data-ad-client="ca-pub-6246142348671168"
             data-ad-slot="9012345678"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
}