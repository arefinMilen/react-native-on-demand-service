# Phase 5: Admin Web Dashboard (Next.js + Tailwind CSS)

## 1. Objective
প্ল্যাটফর্মের সমস্ত কন্ট্রোল, ইউজার ও প্রোভাইডার ভেরিফিকেশন, ক্যাটাগরি ও প্রাইসিং রুলস, লাইভ বুকিং ট্র্যাকিং এবং ফিন্যান্সিয়াল কমিশন ম্যানেজ করার জন্য একটি আধুনিক ও সিকিউর ওয়েব অ্যাডমিন প্যানেল তৈরি করা।

---

## 2. Tech Stack Selection

- **Framework**: Next.js 14+ (App Router, React 18, Server Components & Actions)
- **Styling**: Tailwind CSS + Shadcn UI / Ant Design components
- **State & Data Fetching**: TanStack Query (React Query) v5
- **Charts & Data Viz**: Recharts / Chart.js
- **Map Visualizer**: `react-leaflet` / Google Maps JavaScript API

---

## 3. Core Modules & Screen Specification

### A. Authentication & User Management
1. **Admin Login**: Secure login with JWT & Cookie-based session storage.
2. **User Directory**: কাস্টমার এবং প্রোভাইডারদের ফিল্টারেবল টেবিল (Search by phone, name, status, suspend account switch).

### B. Provider Verification & KYC Console
1. **Pending Approvals Screen**: নতুন রেজিস্টার্ড প্রোভাইডারদের তালিকা।
2. **KycInspectorModal**:
   - প্রোভাইডারের তথ্য, জাতীয় পরিচয়পত্রের ছবি, লাইসেন্স ডকুমেন্টের হাই-রেজোলিউশন ভিউয়ার।
   - বাটন: "Approve Provider" (অটোমেটিক প্রোভাইডারের কাছে SMS/Push যাবে) এবং "Reject" (প্রত্যাখানের কারণ ইনপুট দিয়ে)।

### C. Category & Dynamic Pricing Rules Engine
1. **Category Management Screen**:
   - নতুন ক্যাটাগরি যোগ/এডিট করা (e.g. Electrician, AC Repair, Doctor Consultation).
   - আইকন আপলোড, বর্ণনা, বেস প্রাইস এবং আওয়ারলি রেট সেট করা।
2. **Commission & Surge Setup**:
   - প্ল্যাটফর্ম কমিশন % নির্ধারণ (e.g. 10%, 15%).
   - সার্জ প্রাইসিং কনফিগারেশন (বৃষ্টি বা রাতে বুকিংয়ের জন্য ১.২x, ১.৫x চার্জ)।

### D. Live Booking & Fleet Monitoring Dashboard
1. **Real-time Dispatch Map**:
   - ইন্টারেক্টিভ ম্যাপ ভিউ যাতে সিটির সমস্ত একটিভ সার্ভিস প্রোভাইডার (সবুজ আইকন) এবং রানিং বুকিং (নীল/হলুদ আইকন) লাইভ দেখা যাবে।
2. **Manual Dispatch Override**:
   - কোনো বুকিং অটোমেটিক এসাইন না হলে এডমিন ম্যানুয়ালি কাছাকাছি প্রোভাইডার সিলেক্ট করে জব এসাইন করতে পারবে।

### E. Financial Ledger & Provider Payout Settlement
1. **System Earnings Overview**: প্ল্যাটফর্মের মোট আয়, মোট কমিশন এবং পেন্ডিং পেআউটের হিসাব।
2. **Payout Requests Console**:
   - প্রোভাইডারদের ওয়ালেট থেকে টাকা তোলার আবেদনের টেবিল।
   - ম্যানুয়াল/অটোমেটিক ব্যাংকিং বা bKash/Nagad Payout API দিয়ে টাকা ট্রান্সফার করে "Settled" মার্ক করা।

---

## 4. Key Security & Operational Best Practices
- **Role-Based Access Control (RBAC)**: Super Admin (সব পারমিশন), Operations Manager (কমিশন এডিট করতে পারবে না), Support Agent (শুধুমাত্র রিড-অনলি ভিউ)।
- **Audit Logs**: কে কোন প্রোভাইডার এপ্রুভ করলো বা ক্যাটাগরি প্রাইস চেঞ্জ করলো তার বিস্তারিত টাইমস্ট্যাম্প সহ লগ রাখা।
