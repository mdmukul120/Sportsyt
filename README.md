# FanCode Live - Sports Streaming & Scores

FanCode লাইভ স্পোর্টস স্ট্রিমিং ও স্কোরকার্ড ওয়েব অ্যাপ্লিকেশন। সাদা এবং কমলার (FanCode Signature Orange `#FF5500` & White) প্রিমিয়াম থিমে তৈরি।

## 🌟 প্রধান ফিচারসমূহ (Key Features)

1. **অফিসিয়াল হিরো ব্যানার ও লোগো**: `https://www.fancode.com/skillup-uploads/fc-web/home-page-new-arc/hero-image/v1/hero-image-dweb-v4.png` সহ অফিশিয়াল ফ্যানকোড ব্র্যান্ডিং।
2. **লাইভ ডেটা অ্যানালিসিস**: `Jitendra-unatti/fancode` রিপোজিটরির লাইভ API ডেটা থেকে ৪০টি ম্যাচ (Cricket, Football, Tennis, Golf) এর তথ্য, সময়সূচী এবং স্কোরবোর্ড।
3. **স্মুথ HLS লাইভ স্ট্রিমিং (`hls.js`)**:
   - Master Playback URL এবং Multi-Bitrate সাপোর্ট (1080p, 720p, 540p, 480p, 360p, 240p)।
   - থিয়েটার / সিনেমা মোড (Cinema Mode) ও ফুলস্ক্রিন।
   - পিকচার ইন পিকচার (PiP), ভলিউম স্লাইডার, মিউট ও কীবোর্ড শর্টকাট।
   - লাইভ ক্রিকেট স্কোরকার্ড ওভারলে।
4. **ফলব্যাক ও টেস্ট স্ট্রিম সাপোর্ট**: ফ্যানকোডের টোকেন মেয়াদোত্তীর্ণ বা CDN CORS থাকলে অটোমেটিক টেস্ট স্ট্রিম বা কাস্টম M3U8 লিঙ্ক প্লে করার সুবিধা।
5. **বল-বাই-বল কমেন্ট্রি ও স্কোয়াড**: লাইভ ম্যাচ ট্র্যাকিং, কারেন্ট রান রেট (CRR), টার্গেট ও বল কাউন্ট।

---

## 🚀 GitHub-এ পুশ ও Vercel-এ ডিপ্লয় করার নিয়ম (Deployment Guide)

প্রজেক্টে ইতিমধ্যে `vercel.json` কনফিগার করা আছে। নিচের কমান্ডগুলো আপনার লোকাল কম্পিউটারের টার্মিনালে রান করুন:

```bash
# ১. গিট ইনিশিয়ালাইজ করুন
git init

# ২. সব ফাইল অ্যাড ও কমিট করুন
git add .
git commit -m "feat: FanCode Live streaming & score platform"

# ৩. মেইন ব্রাঞ্চ সেট করুন
git branch -M main

# ৪. আপনার গিটহাব রিপোজিটরির লিঙ্ক যুক্ত করুন
git remote add origin https://github.com/YOUR_USERNAME/fancode-live-app.git

# ৫. গিটহাবে পুশ করুন
git push -u origin main
```

### Vercel-এ ডিপ্লয়:
1. [vercel.com](https://vercel.com) এ লগইন করে **Add New Project** এ ক্লিক করুন।
2. আপনার GitHub রিপোজিটরিটি সিলেক্ট করে **Import** করুন।
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Deploy** বাটনে ক্লিক করুন। কয়েক সেকেন্ডে আপনার অ্যাপ লাইভ হয়ে যাবে!
