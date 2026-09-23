# Phase 4: Service Provider / Doctor Mobile App (React Native)

## 1. Objective
প্রোভাইডার, হ্যান্ডিম্যান বা ডাক্তারদের জন্য একটি নিবেদিত মোবাইল অ্যাপ্লিকেশন তৈরি করা যা দিয়ে তারা নিজেদের ডিউটি স্ট্যাটাস অন/অফ করতে পারবে, নতুন কাজের নোটিফিকেশন একসেপ্ট করতে পারবে, কাস্টমার লোকেশনে নেভিগেট করতে পারবে এবং আয়ের সম্পূর্ণ হিসেব রাখতে পারবে।

---

## 2. Tech Stack & Key Modules

- **Framework**: React Native (Expo CLI / RN CLI)
- **Background Location**: `expo-location` (Task Manager for background location tracking) or `react-native-background-actions`
- **Audio/Vibration Alert**: `expo-av` (For loud incoming job offer ringtone)
- **Maps Navigation**: Google Maps SDK / Waze deep linking launch
- **State & Storage**: Redux Toolkit + Async Storage (Auth session persistence)

---

## 3. Key UI Screens & Provider Workflow

### A. KYC & Setup Flow
1. **ProviderRegisterScreen**: নাম, মোবাইল নম্বর, সার্ভিস ক্যাটাগরি ও স্কিল সিলেক্টর।
2. **KycUploadScreen**: জাতীয় পরিচয়পত্র (NID / Passport) ও সার্টিফিকেট/লাইসেন্সের ছবি তোলা এবং আপলোড করা।
3. **KycStatusScreen**: "Verification Pending" ব্যানার (এডমিন এপ্রুভ না করা পর্যন্ত অ্যাপ রিড-অনলি মোডে থাকবে)।

### B. Duty Management & Incoming Job Dispatch
1. **DutyDashboardScreen**:
   - বড় "Go Online" / "Go Offline" টগল বাটন।
   - টপ স্ট্যাটাস: "You are Online - Waiting for nearby requests".
   - ব্যাকগ্রাউন্ডে লোকেশন ট্র্যাকিং সার্ভিস চালু করা।
2. **IncomingJobModal (Full-Screen Alert)**:
   - প্রোভাইডারের কাছে সকেটে অফার আসলে লাউড রিংটোন বাজবে।
   - স্ক্রিনে দেখাবে: সার্ভিস ক্যাটাগরি, কাস্টমারের দূরত্ব (e.g. 2.4 km away), আনুমানিক আয় (e.g. ৳500), এবং ৩০ সেকেন্ডের সার্কুলার টাইমার।
   - বাটন: "Accept Job" (সবুজ) এবং "Decline" (লাল)।

### C. Active Service Lifecycle
1. **JobNavigationScreen**:
   - কাস্টমারের ঠিকানা এবং ম্যাপ ডায়রেকশন।
   - "Open Google Maps Navigation" ডাইরেক্ট বাটন।
   - ইন-অ্যাপ কল ও মেসেজিং বাটন।
   - স্লাইডার/বাটন: "Arrived at Location".
2. **JobExecutionScreen**:
   - সার্ভিস প্রগ্রেস টাইমার।
   - স্লাইডার/বাটন: "Start Service" -> কাজ শেষে "Complete Service".
3. **BillSummaryModal**:
   - মোট বিল, ক্যাশ কালেকশন এর পরিমাণ, এবং অটোমেটিক প্ল্যাটফর্ম কমিশন কাটার রসিদ।

### D. Earnings & Wallet Dashboard
1. **EarningsScreen**:
   - দৈনিক, সাপ্তাহিক ও মাসিক আয়ের বার চার্ট।
   - ওয়ালেট ব্যালেন্স: ক্যাশ কালেকশনের হিসাব এবং সিস্টেম কমিশনের সাথে অ্যাডজাস্টমেন্ট।
   - "Request Payout" বাটন (bKash / Bank details ইনপুট দিয়ে টাকা তোলার আবেদন)।

---

## 4. Key Technical Challenges & Solutions

1. **Keep-Alive Background GPS Streaming**:
   - প্রোভাইডার অ্যাপ মিনিমাইজ বা স্ক্রিন লক থাকলেও প্রতি ৫-১০ সেকেন্ড পর পর ব্যাকগ্রাউন্ড লুপে সার্ভারে GPS কোঅর্ডিনেট পাঠাবে।
   - অ্যান্ড্রয়েডে `Foreground Service Notification` ("App is using your location in background") ব্যবহার করা হবে যেন ওএস ব্যাকগ্রাউন্ড প্রসেস কিল না করে।
2. **Preventing Missed Job Requests**:
   - FCM High Priority Push Notification ইন্টিগ্রেশন যেন অ্যাপ একদম কিল্ড (Killed State) থাকলেও ফুল-স্ক্রিন ইনকামিং কল ডিসপ্লে ট্র্রিগার হয়।
