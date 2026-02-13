'use client';

import { FormEvent, useState } from 'react';
import styles from './BusinessCard.module.css';

export default function BusinessCard() {
  const [isJiggling, setIsJiggling] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  };

  const foldVCardLine = (line: string, maxLength = 74) => {
    if (line.length <= maxLength) return line;

    const chunks: string[] = [];
    for (let i = 0; i < line.length; i += maxLength) {
      chunks.push(line.slice(i, i + maxLength));
    }

    return chunks.join('\r\n ');
  };

  const generateVCard = async () => {
    const timestamp = new Date().toISOString();
    const rev = timestamp.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const uid = `world-of-zaharoff-${Date.now()}@zaharoff.com`;

    let photoField = '';
    try {
      const imageResponse = await fetch('/Z.png');
      if (imageResponse.ok) {
        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBase64 = arrayBufferToBase64(imageBuffer);
        photoField = `${foldVCardLine(`PHOTO;ENCODING=BASE64;TYPE=PNG:${imageBase64}`)}\r\n`;
      }
    } catch {
      // Keep vCard generation working even if logo fetch fails.
    }

    const vCard = `BEGIN:VCARD\r
VERSION:3.0\r
FN:World of Zaharoff\r
N:World of Zaharoff;;;;\r
ORG:World of Zaharoff\r
UID:${uid}\r
REV:${rev}\r
TEL;TYPE=CELL:7739103784\r
EMAIL;TYPE=INTERNET:info@zaharoff.com\r
URL:https://zaharoff.com/\r
NOTE:The marco polo of fashion and luxury goods sold in America "only".\r
${photoField}END:VCARD\r
`;
    
    return new Blob([vCard], { type: 'text/vcard' });
  };

  const buildSmsUrl = (message: string) => {
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isiOS ? '&' : '?';
    return `sms:7739103784${separator}body=${encodeURIComponent(message)}`;
  };

  const saveContact = async () => {
    try {
      setIsSavingContact(true);

      // Trigger jiggle animation
      setIsJiggling(true);
      setTimeout(() => setIsJiggling(false), 600);

      const vCardBlob = await generateVCard();
      const url = URL.createObjectURL(vCardBlob);
      
      // Create temporary link to download vCard
      const link = document.createElement('a');
      link.href = url;
      link.download = 'world-of-zaharoff.vcf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setShowMessageForm(true);

    } catch (error) {
      console.error('Error saving contact:', error);
      setShowMessageForm(true);
    } finally {
      setIsSavingContact(false);
    }
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = [
      'Hi George, I just saved your contact info.',
      `Name: ${formData.name || 'N/A'}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
    ].join('\n');
    window.open(buildSmsUrl(message), '_self');
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
                disabled={isSavingContact}
                className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-green-400 relative overflow-hidden ${isJiggling ? styles.jiggleAnimation : ''}`}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-green-400 opacity-30 rounded-xl blur-md animate-pulse"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  {isSavingContact ? 'Saving...' : 'Save Contact'}
                </div>
              </button>
            </div>

            {showMessageForm && (
              <div className="mb-8 rounded-xl border border-green-400/30 bg-black/60 p-4">
                <p className="text-sm text-green-100 mb-3">
                  Want to send a text now? Fill this out and we will prefill your message.
                </p>
                <form onSubmit={sendMessage} className="space-y-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-green-400/40 bg-black/70 px-3 py-2 text-white placeholder:text-green-200/60 outline-none focus:border-green-300"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="Your email"
                    required
                    className="w-full rounded-lg border border-green-400/40 bg-black/70 px-3 py-2 text-white placeholder:text-green-200/60 outline-none focus:border-green-300"
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                    placeholder="Your phone number"
                    required
                    className="w-full rounded-lg border border-green-400/40 bg-black/70 px-3 py-2 text-white placeholder:text-green-200/60 outline-none focus:border-green-300"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg border border-green-400 bg-green-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-green-400"
                    >
                      Open Text App
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMessageForm(false)}
                      className="rounded-lg border border-green-400/40 px-4 py-2 text-sm font-semibold text-green-100 hover:bg-white/10"
                    >
                      Not Now
                    </button>
                  </div>
                </form>
              </div>
            )}

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
