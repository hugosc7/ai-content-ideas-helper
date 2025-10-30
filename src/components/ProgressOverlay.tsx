import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const MESSAGE_INTERVAL = 2200;
const FAKE_TOTAL_TIME = 42000; // ms fallback pacing (3x slower)

const messages = [
  '🧠 Cooking up world-class strategies for you...',
  '✨ Writing scroll-stopping hooks...',
  '🤓 Studying your customer avatar...',
  '👀 Reviewing what works best in your market...',
  '🎯 Making your content stand out...',
  '🌈 Adding some AI-generated magic...',
  '🚀 Almost ready! Just putting on the finishing touches...'
];

interface ProgressOverlayProps {
  onDone?: () => void;
}

export const ProgressOverlay: React.FC<ProgressOverlayProps> = ({ onDone }) => {
  const [messageIdx, setMessageIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const start = Date.now();

    function animate() {
      if (!mounted) return;
      const elapsed = Date.now() - start;
      const next = Math.min(100, Math.round((elapsed / FAKE_TOTAL_TIME) * 100));
      setProgress(next < 95 ? next : 95);
      if (next < 95) requestAnimationFrame(animate);
    }
    animate();

    const msgIv = setInterval(() => {
      setMessageIdx(i => (i + 1) % messages.length);
    }, MESSAGE_INTERVAL);

    let doneTimer: number | undefined;
    if (onDone) {
      doneTimer = window.setTimeout(onDone, FAKE_TOTAL_TIME);
    }

    return () => {
      mounted = false;
      clearInterval(msgIv);
      if (doneTimer) window.clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-75 animate-fade-in">
      <div className="w-11/12 sm:w-2/3 md:w-1/2 max-w-lg bg-gray-900 border-2 border-accent-yellow p-8 rounded-3xl shadow-xl flex flex-col items-center">
        <Sparkles className="w-10 h-10 text-accent-yellow mb-4" />
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-3 bg-gradient-to-r from-accent-yellow via-pink-400 to-purple-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 mb-3 text-base text-accent-yellow text-center font-semibold min-h-[48px]">
          {messages[messageIdx]}
        </p>
        <p className="text-xs text-gray-400 text-center">Sit tight—amazing ideas coming soon!</p>
      </div>
    </div>
  );
};


