'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdsProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function GoogleAds({ 
  slot, 
  format = "auto", 
  responsive = true, 
  style,
  className = ""
}: GoogleAdsProps) {
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
    <div className={`ads-container block ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-6246142348671168"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}

// Pre-configured ad components
export function BannerAd({ className }: { className?: string }) {
  return (
    <GoogleAds
      slot="1234567890"
      format="horizontal"
      className={`w-full h-[90px] ${className}`}
    />
  );
}

export function SquareAd({ className }: { className?: string }) {
  return (
    <GoogleAds
      slot="2345678901"
      format="rectangle"
      className={`w-[300px] h-[250px] ${className}`}
    />
  );
}

export function SidebarAd({ className }: { className?: string }) {
  return (
    <GoogleAds
      slot="3456789012"
      format="vertical"
      className={`w-[160px] h-[600px] ${className}`}
    />
  );
}