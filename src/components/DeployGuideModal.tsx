import React, { useState } from 'react';
import { X, Github, Cloud, Check, Copy, Terminal, ExternalLink } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCommand = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "feat: FanCode Live streaming & score app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fancode-live-stream.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                GitHub & Vercel Deployment Guide
              </h3>
              <p className="text-xs text-slate-500">
                গিটহাবে পুশ করে ভের্সেলে ডিপ্লয় করার সম্পূর্ণ গাইড
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

        {/* Status Checklist */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
          <div className="font-bold text-emerald-900 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            অ্যাপ্লিকেশনটি ভের্সেল এবং গিটহাবের জন্য সম্পূর্ণ প্রস্তুত:
          </div>
          <ul className="space-y-1 text-emerald-800 ml-6 list-disc">
            <li><strong>vercel.json</strong> কনফিগারেশন যোগ করা হয়েছে (SPA routing & rewrites)।</li>
            <li>ক্লিন Vite Client-side বিল্ড (যাতে কোনো ব্যাকএন্ড সার্ভার বা প্রক্সি ছাড়াই চলে)।</li>
            <li>GitHub API এবং Bundled Fallback ডেটা উভয় সাপোর্ট করা রয়েছে (CORS ফ্রি)।</li>
            <li>Hls.js লাইভ স্ট্রিমিং ও রেসপনসিভ প্লেয়ার সংযুক্ত।</li>
          </ul>
        </div>

        {/* Step 1: Git Commands */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-black">
                1
              </span>
              গিটহাবে কোড পুশ করার কমান্ড (Terminal):
            </h4>
            <button
              onClick={() => copyCommand(gitCommands, 1)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy All Commands</span>
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl p-3 text-slate-200 font-mono text-xs overflow-x-auto">
            <pre className="whitespace-pre">{gitCommands}</pre>
          </div>
        </div>

        {/* Step 2: Vercel Import */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-black">
              2
            </span>
            Vercel-এ ইম্পোর্ট ও ডিপ্লয় করার ধাপ:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">1. Vercel ড্যাশবোর্ড</span>
              <p className="text-slate-600 text-[11px]">
                <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-orange-600 font-semibold underline inline-flex items-center gap-0.5">
                  vercel.com/new <ExternalLink className="w-2.5 h-2.5" />
                </a> এ গিয়ে GitHub সিলেক্ট করুন।
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">2. রিপোজিটরি সিলেক্ট</span>
              <p className="text-slate-600 text-[11px]">
                আপনার গিটহাব রিপোজিটরিটি Import করুন।
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">3. এক ক্লিকে Deploy</span>
              <p className="text-slate-600 text-[11px]">
                Build Command: <code className="bg-slate-200 px-1 rounded">npm run build</code>, আউটপুট ডিরেক্টরি <code className="bg-slate-200 px-1 rounded">dist</code> স্বয়ংক্রিয়ভাবে থাকবে।
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            vercel.json ফাইলটি প্রজেক্টে ইতিমধ্যে কনফিগার করা আছে।
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
