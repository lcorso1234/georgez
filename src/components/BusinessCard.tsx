'use client';

import { useState } from 'react';
import styles from './BusinessCard.module.css';

export default function BusinessCard() {
  const [isJiggling, setIsJiggling] = useState(false);

  const generateVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:George Zaharoff
N:Zaharoff;George;;;
TEL;TYPE=CELL:7739103784
END:VCARD`;
    
    return new Blob([vCard], { type: 'text/vcard' });
  };

  const saveContact = async () => {
    try {
      // Trigger jiggle animation
      setIsJiggling(true);
      setTimeout(() => setIsJiggling(false), 600);

      const vCardBlob = generateVCard();
      const url = URL.createObjectURL(vCardBlob);
      
      // Create temporary link to download vCard
      const link = document.createElement('a');
      link.href = url;
      link.download = 'george-zaharoff.vcf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Open SMS with automated message
      const message = encodeURIComponent("Hi George! I've saved your contact info and you're now part of my network. Looking forward to connecting!");
      const smsUrl = `sms:7739103784?body=${message}`;
      window.open(smsUrl, '_self');

    } catch (error) {
      console.error('Error saving contact:', error);
      // Fallback: open SMS directly
      const message = encodeURIComponent("Hi George! I'd like to add you to my contacts and network!");
      const smsUrl = `sms:7739103784?body=${message}`;
      window.open(smsUrl, '_self');
    }
  };

  const callGeorge = () => {
    window.open('tel:7739103784', '_self');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Noise texture background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Business Card */}
      <div className={`relative w-full max-w-sm mx-auto ${styles.perspective}`}>
        <div className={`bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-green-400/30 transform transition-all duration-500 relative overflow-hidden hover:scale-105 ${styles.rotate3d}`}>
          
          {/* 3D depth effect */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl transform translate-x-1 translate-y-1 -z-10"></div>
          <div className="absolute inset-0 bg-black/80 rounded-2xl transform translate-x-2 translate-y-2 -z-20"></div>
          
          {/* Neon green accent border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-green-500 opacity-40 blur-sm animate-pulse"></div>
          <div className="absolute inset-[2px] rounded-2xl bg-black/70 backdrop-blur-xl shadow-inner border border-green-400/20"></div>
          
          {/* Card Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8 border-b border-green-400/30 pb-6">
              <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
                <span className="text-green-400 drop-shadow-lg shadow-green-400">George</span> Zaharoff
              </h1>
              <div className="w-12 h-1 bg-green-400 mx-auto rounded-full shadow-lg shadow-green-400/50 animate-pulse"></div>
            </div>

            {/* Phone Number */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg px-6 py-3 shadow-inner border border-green-400/30">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-white text-lg font-mono tracking-wider">773.910.3784</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <button
                onClick={saveContact}
                className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-green-400 relative overflow-hidden ${isJiggling ? styles.jiggleAnimation : ''}`}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-green-400 opacity-30 rounded-xl blur-md animate-pulse"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Save Contact
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center border-t border-green-400/30 pt-4">
              <p className="text-white text-sm font-semibold mb-1 tracking-wide drop-shadow-lg">
                Built in America, on earth.
              </p>
              <p className="text-green-100 text-xs italic">
                Making relationships built to last, the American Way.
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse delay-1000"></div>
        </div>
      </div>


    </div>
  );
}