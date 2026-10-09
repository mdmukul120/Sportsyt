import React, { useState } from 'react';
import { X, Play, Link } from 'lucide-react';

interface CustomStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayUrl: (url: string, label: string) => void;
}

export const CustomStreamModal: React.FC<CustomStreamModalProps> = ({
  isOpen,
  onClose,
  onPlayUrl,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [streamName, setStreamName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePlay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setError('একটি বৈধ লাইভ স্ট্রিম URL (যেমন .m3u8 লিঙ্ক) দিন');
      return;
    }
    setError('');
    onPlayUrl(inputUrl.trim(), streamName.trim() || 'Custom M3U8 Stream');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Link className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                কাস্টম লাইভ স্ট্রিম প্লেয়ার (HLS .m3u8)
              </h3>
              <p className="text-xs text-slate-500">
                আপনার কাছে থাকা যেকোনো রিয়েল লাইভ M3U8 স্ট্রিম লিঙ্ক সরাসরি প্লে করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handlePlay} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              ম্যাচ বা স্ট্রিমের নাম (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="যেমন: Bangladesh vs Australia Live"
              value={streamName}
              onChange={(e) => setStreamName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              লাইভ M3U8 প্লেব্যাক URL <span className="text-orange-600">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://example.com/live/index.m3u8"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono text-xs"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              প্লে শুরু করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
