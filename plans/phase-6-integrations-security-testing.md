# Phase 6: Third-Party Integrations, Security & Production Hardening

## 1. Objective
প্ল্যাটফর্মের থার্ড-পার্টি সার্ভিসেস (পেমেন্ট গেটওয়ে, এসএমএস, পুশ নোটিফিকেশন, ভিডিও কলিং) যুক্ত করা, ডাটা ও নেটওয়ার্ক সিকিউরিটি সুনিশ্চিত করা এবং সম্পূর্ণ সিস্টেমের অ্যান্ড-টু-অ্যান্ড টেস্ট সম্পাদন করা।

---

## 2. Third-Party Integrations Blueprint

### A. Local & Global Payment Gateways
1. **bKash Tokenized Checkout API**:
   - `Create Payment` -> `Execute Payment` -> `Webhook IPN (Instant Payment Notification)`.
   - কাস্টমার অ্যাপ থেকে ডাইরেক্ট bKash পিন/ওটিপি পপআপে পেমেন্ট কমপ্লিট করা।
2. **SSLCommerz / Stripe Integration**:
   - ডেবিট/ক্রেডিট কার্ড এবং অন্যান্য মোবাইল ব্যাংকিংয়ের জন্য পেমেন্ট গেটওয়ে রিডাইরেক্ট ও সিংক সাপোর্ট।
3. **Automated Wallet Adjustment**:
   - পেমেন্ট সফল হলে ব্যাকএন্ডের `Webhook Listener` এআইডি দিয়ে বুকিং `isPaid = true` মার্ক করবে এবং প্রোভাইডারের ওয়ালেটে কমিশন বাদ দিয়ে অবশিষ্ট অ্যামাউন্ট যোগ করবে।

### B. Push Notifications & SMS (FCM + Twilio/SSL Wireless)
1. **Firebase Cloud Messaging (FCM)**:
   - অ্যাপ ব্যাকগ্রাউন্ড বা ক্লোজড থাকলেও গুরুত্বপূর্ণ ঘটনা (e.g. New Job Offer, Driver Arrived, Booking Cancelled) পুশ নোটিফিকেশন পাঠাবে।
2. **SMS Gateway**:
   - নিবন্ধনের সময় ওটিপি কোড (OTP) পাঠানোর জন্য Twilio (গ্লোবাল) বা SSL Wireless / BulkSMS (বাংলাদেশের জন্য)।

### C. Agora Video Calling (Doctor Consultation Module)
1. **Agora RTC React Native SDK**:
   - ডক্টর কনসালটেশনের ক্ষেত্রে পেশেন্ট ও ডাক্তারের মধ্যে অ্যাপের ভেতরেই ১-অন-১ এইচডি ভিডিও ও অডিও কল চালু করার ফিচার।
2. **Dynamic RTC Token Generator**:
   - ব্যাকএন্ড থেকে সুরক্ষিত সাময়িক Agora RTC Token জেনারেট করে সকেটের মাধ্যমে কল রিকোয়েস্টে রিলে করা।

### D. Cloud File Storage (AWS S3 / Firebase Storage)
1. **Presigned URLs Upload Flow**:
   - মোবাইল বা অ্যাডমিন সরাসরি ব্যাকএন্ড থেকে Presigned Upload URL নিয়ে AWS S3 তে নিরাপদে এনআইডি, প্রোফাইল পিকচার ও লাইসেন্স ছবি আপলোড করবে।

---

## 3. Security & Production Hardening

1. **API Rate Limiting**:
   - `express-rate-limit` এবং Redis দিয়ে ডিডস (DDoS) ও ব্রুটফোর্স ওটিপি অ্যাটাক প্রতিরোধ (e.g. Max 3 OTP requests per phone number per hour).
2. **Nginx Reverse Proxy & SSL**:
   - HTTPS Encryption (Let's Encrypt SSL Certbot).
   - Nginx Reverse Proxy দিয়ে ব্যাকএন্ডের পোর্ট হাইড রাখা এবং লোড ব্যালেন্সিং নিশ্চিত করা।
3. **Data Protection & Sanitization**:
   - SQL Injection (Prisma/ORM automatic parameterized queries).
   - Helmet.js দিয়ে HTTP হেডার সুরক্ষিত করা।
   - পাসওয়ার্ড হ্যশিং (bcrypt.js salt rounds = 12).

---

## 4. End-to-End Testing & Deployment Plan

### Testing Verification Checklist
- [ ] **OTP Auth Test**: ওটিপি জেনারেশন, ভ্যালিডেশন এবং ৩ মিনিট এক্সপায়ার হওয়া পরীক্ষা করা।
- [ ] **Real-Time Geo Match Test**: ড্রাইভার ম্যাপের বাইরে থাকলে অফার না যাওয়া এবং ভেতরে আসলে সকেটে অফার আসার ট্র্যাকিং পরীক্ষা করা।
- [ ] **Concurrent Accept Test**: একাধিক ড্রাইভার একসাথে একসেপ্ট বাটনে চাপলে রেস কন্ডিশন না হওয়া।
- [ ] **Webhook IPN Test**: পেমেন্ট গেটওয়ের সিমুলেটেড কলব্যাক থেকে বুকিং আপডেট হওয়া।

### Deployment Stack
- **Backend API**: Docker Containerized Deployment / PM2 cluster mode on DigitalOcean / AWS EC2.
- **Database**: Managed PostgreSQL (AWS RDS / DigitalOcean Managed DB) + Managed Redis instance.
- **Admin Dashboard**: Vercel / Netlify Deployment.
- **Mobile Apps**: Expo Application Services (EAS) Build for Android (APK/AAB) & iOS (IPA TestFlight).
