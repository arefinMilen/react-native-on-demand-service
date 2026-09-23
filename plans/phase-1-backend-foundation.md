# Phase 1: Backend Architecture Blueprint & Core Foundation

## 1. Objective
একটি শক্ত ও স্কেলেবল ব্যাকএন্ড মেট্রিফাইড আর্কিটেকচার তৈরি করা যা RESTful APIs, সিকিউর অ্যানোনিমাস/ওটিপি/পাসওয়ার্ড অথেন্টিকেশন, ডাটাবেস স্কিমা মডেলিং এবং এনভায়রনমেন্ট কনফিগারেশন কভার করবে।

---

## 2. Tech Stack Selection & Justification

- **Runtime**: Node.js (v18+ LTS / v20+)
- **Framework**: Express.js (or NestJS with TypeScript)
- **Primary Database**: **PostgreSQL** with **Prisma ORM** (নির্ধারিত)
  - *Justification*: বুকিং ট্রানজেকশন, ওয়ালেট ও আর্থিক হিসেব-নিকাশের সঠিকতার জন্য ACID compliance ও Relational Integrity অপরিহার্য।
- **In-Memory Cache**: Redis (`ioredis` package)
- **Authentication**: JWT (JSON Web Tokens) with Short-lived Access Token (15 mins) & Refresh Token (7 days).
- **Validation**: Zod / Joi schema validation.

---

## 3. Database Schema Blueprint (PostgreSQL / Prisma Example)

```prisma
enum Role {
  CUSTOMER
  PROVIDER
  ADMIN
}

enum AccountStatus {
  PENDING_VERIFICATION
  ACTIVE
  SUSPENDED
  BLOCKED
}

enum BookingStatus {
  REQUESTED
  SEARCHING_PROVIDER
  ACCEPTED
  ARRIVED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model User {
  id            String         @id @default(uuid())
  phone         String         @unique
  email         String?        @unique
  passwordHash  String?
  role          Role           @default(CUSTOMER)
  status        AccountStatus  @default(PENDING_VERIFICATION)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  customerProfile CustomerProfile?
  providerProfile ProviderProfile?
  bookingsAsUser  Booking[]       @relation("CustomerBookings")
  bookingsAsProv  Booking[]       @relation("ProviderBookings")
  wallet          Wallet?
}

model CustomerProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  fullName    String
  avatarUrl   String?
  address     String?
}

model ProviderProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  fullName        String
  avatarUrl       String?
  nationalIdNo    String?
  kycDocUrls      String[] // ID card, Medical License/Certificates
  isKycVerified   Boolean  @default(false)
  isOnline        Boolean  @default(false)
  currentLat      Float?
  currentLng      Float?
  ratingAvg       Float    @default(5.0)
  totalRatings    Int      @default(0)
  serviceCategories ServiceCategory[]
}

model ServiceCategory {
  id          String   @id @default(uuid())
  name        String
  description String?
  iconUrl     String?
  basePrice   Float
  hourlyRate  Float?
  commissionPercent Float @default(10.0) // Platform commission %
  providers   ProviderProfile[]
  bookings    Booking[]
}

model Booking {
  id               String        @id @default(uuid())
  bookingNumber    String        @unique
  customerId       String
  customer         User          @relation("CustomerBookings", fields: [customerId], references: [id])
  providerId       String?
  provider         User?         @relation("ProviderBookings", fields: [providerId], references: [id])
  serviceId        String
  service          ServiceCategory @relation(fields: [serviceId], references: [id])
  status           BookingStatus @default(REQUESTED)
  pickupLat        Float
  pickupLng        Float
  addressText      String
  totalAmount      Float
  commissionAmount Float
  providerEarnings Float
  paymentMethod    String        // CASH, BKASH, STRIPE
  isPaid           Boolean       @default(false)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

model Wallet {
  id         String   @id @default(uuid())
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id])
  balance    Float    @default(0.0)
  updatedAt  DateTime @updatedAt
}
```

---

## 4. API Endpoints Specification

### Auth Routes (`/api/v1/auth`)
- `POST /send-otp` -> Send 6-digit OTP to mobile phone (stored in Redis for 3 mins).
- `POST /verify-otp` -> Validate OTP, return Auth Token / Prompt for registration.
- `POST /register` -> Complete user/provider registration.
- `POST /login` -> Phone/Password or Phone/OTP login.
- `POST /refresh-token` -> Issue new access token using refresh token.

### Customer Routes (`/api/v1/customer`)
- `GET /categories` -> List active service categories & pricing.
- `GET /providers/nearby` -> Find nearby active providers based on lat/lng.
- `POST /bookings` -> Create a new booking request.
- `GET /bookings/history` -> Get customer booking history.
- `GET /bookings/:id` -> Get detailed booking status.

### Provider Routes (`/api/v1/provider`)
- `PATCH /kyc-submit` -> Upload KYC document links & National ID info.
- `PATCH /toggle-duty` -> Switch online/offline status (`isOnline`).
- `GET /earnings` -> Get total earnings & wallet balance.
- `GET /jobs/history` -> Get completed & assigned jobs.

### Admin Routes (`/api/v1/admin`)
- `GET /kyc/pending` -> List providers waiting for KYC approval.
- `PATCH /kyc/:id/verify` -> Approve or reject provider KYC.
- `POST /categories` -> Create/Update service categories & pricing rules.
- `GET /analytics/overview` -> Total bookings, system commission, active users count.

---

## 5. Step-by-Step Implementation Steps

1. `backend` ডিরেক্টরি ইনিশিয়ালাইজেশন: Node.js, Express, TypeScript, Nodemon, dotenv, Cors.
2. Database ODM/ORM integration: Prisma (PostgreSQL) setup & migration scripts.
3. Auth Middleware: JWT verification & Role-based Access Control (`requireAuth`, `requireRole(['ADMIN'])`).
4. Redis Service: Setup Redis connection module for OTP caching and session tokens.
5. Service Controllers & Input Validation: Zod Schemas for auth and booking payload validation.
