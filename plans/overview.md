# On-Demand Service Platform - Overall Architecture & Project Overview

## 1. System Vision
এই প্রজেক্টটি একটি স্কেলেবল, হাই-পারফরম্যান্স অন-ডিমান্ড সার্ভিস প্ল্যাটফর্ম (যেমন: হ্যান্ডিম্যান, মেকানিক, বা ডক্টর কনসালটেশন)। এতে মূলত ৩টি প্রাইমারি ফ্রন্টএন্ড অ্যাপ এবং একটি সেন্ট্রাল রিয়েল-টাইম ব্যাকএন্ড ইকোসিস্টেম থাকবে।

---

## 2. System Architecture Layers

```
                               ┌────────────────────────────────────────┐
                               │            CLIENT LAYER                │
                               ├───────────────────┬────────────────────┤
                               │ Customer App (RN) │ Provider App (RN)  │
                               │                   ├────────────────────┤
                               │                   │ Admin Web (Next.js)│
                               └─────────┬─────────┴──────────┬─────────┘
                                         │                    │
                                         ▼                    ▼
                               ┌────────────────────────────────────────┐
                               │          API GATEWAY & PROXY           │
                               │        Nginx / Rate Limiter / CORS     │
                               └─────────────────┬──────────────────────┘
                                                 │
                                                 ▼
                               ┌────────────────────────────────────────┐
                               │           APPLICATION LAYER            │
                               │ Node.js (Express/NestJS) - REST API    │
                               │ Socket.io - Real-Time GIS & Chat Engine│
                               │ BullMQ - Background Task Scheduler     │
                               └─────────────────┬──────────────────────┘
                                                 │
                                                 ▼
                               ┌────────────────────────────────────────┐
                               │          DATA & CACHE LAYER            │
                               │ PostgreSQL (Prisma ORM) - Primary DB   │
                               │ Redis - Geo-spatial Index & Auth Cache │
                               └─────────────────┬──────────────────────┘
                                                 │
                                                 ▼
                               ┌────────────────────────────────────────┐
                               │          THIRD-PARTY SERVICES          │
                               │ Maps: Google Maps API                  │
                               │ Push: Firebase FCM                     │
                               │ SMS: Twilio / SSL Wireless             │
                               │ Payment: bKash / SSLCommerz / Stripe   │
                               │ Video: Agora RTC (Doctor Consultation) │
                               └────────────────────────────────────────┘
```

---

## 3. High-Level Folder & Monorepo Structure Plan

```
react-native/
├── plans/                                 # Phase-wise documentation
│   ├── overview.md                        # Master Overview
│   ├── phase-1-backend-foundation.md      # Backend Architecture & DB
│   ├── phase-2-realtime-matching-engine.md# Socket.io & Geo Matching
│   ├── phase-3-customer-mobile-app.md     # Customer React Native App
│   ├── phase-4-provider-mobile-app.md     # Provider/Doctor RN App
│   ├── phase-5-admin-web-dashboard.md     # Next.js Admin Panel
│   └── phase-6-integrations-security-testing.md # Integrations & E2E Testing
├── backend/                               # Node.js API & Socket Server
├── apps/
│   ├── customer-app/                      # React Native Customer App
│   ├── provider-app/                      # React Native Provider App
│   └── admin-dashboard/                   # Next.js Admin Panel
└── shared/                                # Shared DTOs, types, constants
```

---

## 4. Phase Breakdown Summary

- **Phase 1**: Backend Architecture, Auth Module, Database Schema & Core REST APIs
- **Phase 2**: Real-Time Matching Engine, Socket.io Broadcasts & Redis GIS Indexing
- **Phase 3**: Customer Mobile App (React Native) – Booking Flow, Live Map & Payment
- **Phase 4**: Provider / Doctor Mobile App (React Native) – Duty Toggle, Job Modal & Earnings
- **Phase 5**: Admin Web Dashboard (Next.js) – KYC Approval, Category Pricing & Live Monitor
- **Phase 6**: Integrations (Payments, SMS, FCM, Agora Video), Security & End-to-End Testing
