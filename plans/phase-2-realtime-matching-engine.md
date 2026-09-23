# Phase 2: Real-time Infrastructure & Provider Matching Engine

## 1. Objective
Socket.io এবং Redis Geo-spatial Indexing ব্যবহার করে মিলি-সেকেন্ড রেসপন্স টাইমে কাছাকাছি থাকা সার্ভিস প্রোভাইডারদের খুঁজে বের করা, অটোমেটেড জব ডিচপ্যাচ করা এবং লাইভ লোকেশন ট্র্যাকিং নিশ্চিত করা।

---

## 2. Architecture & Data Flow

```
[ Customer App ]               [ Backend Socket Server ]                [ Redis Store ]
       │                                   │                                  │
       │ -- 1. Request Job (lat, lng) -->  │                                  │
       │                                   │ -- 2. GEOSEARCH 5km Radius ----> │
       │                                   │ <-- 3. Return Matching Providers --│
       │                                   │                                  │
       │                                   │ == 4. Dispatch Job via Socket ==> [ Provider Apps ]
       │                                   │                                          │
       │ <== 6. Emit "Driver Accepted" === │ <== 5. Accept Job Event (within 30s) == │
       │                                   │                                          │
       │ <== 7. Stream Live GPS Lat/Lng == │ <== 8. Emit "location_update" (5s) ===== │
```

---

## 3. Core Components & Implementation

### A. Redis Geo-Spatial Management
1. **Location Store Key**: `active_providers:<category_id>`
2. **Provider Update Logic**:
   - প্রোভাইডার অ্যাপ অন-ডিউটি থাকলে প্রতি ৫-১০ সেকেন্ডে ব্যাকএন্ড সকেটে GPS কোঅর্ডিনেট পাঠাবে।
   - ব্যাকএন্ড কমান্ড চালাবে: `GEOADD active_providers:<category_id> <longitude> <latitude> <provider_id>`
   - প্রোভাইডার অফলাইন হলে বা অফ-ডিউটি চাপলে: `ZREM active_providers:<category_id> <provider_id>`

### B. Socket.io Event Definitions

| Event Name | Direction | Payload Description |
| :--- | :--- | :--- |
| `provider_location_update` | Provider -> Server | `{ providerId, lat, lng, categoryId }` |
| `request_booking` | Customer -> Server | `{ bookingId, serviceId, lat, lng, address }` |
| `new_job_offer` | Server -> Provider | `{ bookingId, serviceTitle, customerName, distanceKm, estEarnings, expiresAt }` |
| `accept_job` | Provider -> Server | `{ bookingId, providerId }` |
| `reject_job` | Provider -> Server | `{ bookingId, providerId }` |
| `provider_assigned` | Server -> Customer | `{ bookingId, providerDetails: { name, phone, rating, avatar, lat, lng } }` |
| `live_tracking_update` | Server -> Customer | `{ bookingId, currentLat, currentLng, etaMinutes }` |
| `job_status_change` | Server -> Both | `{ bookingId, status: 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' }` |

---

## 4. Smart Matching & Dispatch Algorithm

1. **Radius Search**:
   - Customer বুকিং রিকোয়েস্ট পাঠালে Backend Redis এ কোয়েরি করবে:
     `GEOSEARCH active_providers:<category_id> FROMLONLAT <lng> <lat> BYRADIUS 5 KM ASC COUNT 5`
2. **Sequential or Broadcast Dispatch**:
   - **Option A (Broadcast)**: ৫ কিমির মধ্যে থাকা সেরা ৩ জন প্রোভাইডারকে একসাথে `new_job_offer` পাঠানো হয়। যে প্রথম "Accept" চাপবে, জবটি তার অধীনে চলে যাবে (First-Come-First-Serve)।
   - **Option B (Sequential)**: নিকটতম ১ নম্বর প্রোভাইডারকে ৩০ সেকেন্ডের কাউন্টডাউন সহ পাঠানো হয়। Reject করলে বা টাইমআউট হলে ২ নম্বর প্রোভাইডারে ফলব্যাক করবে (BullMQ Delayed Job Queue দ্বারা পরিচালিত)।
3. **Race Condition Prevention**:
   - রিয়েল-টাইমে ডাটাবেস লেভেলে `Atomic Lock` (Redis `SETNX` or Postgres Row Lock) ব্যবহার করা হবে যেন একজন প্রোভাইডার Accept চাপার পর অন্য কেউ বুকিংটি ছিনিয়ে নিতে না পারে।

---

## 5. Background Task Queues (BullMQ + Redis)

- **Job Expiration Queue**: ৩০ সেকেন্ডের মধ্যে অফার একসেপ্ট না হলে অফারটি অটোমেটিক পরবর্তী ড্রাইভার/প্রোভাইডারের কাছে পাঠাবে।
- **Unassigned Fallback**: ৩ কিমি থেকে স্প্যান বাড়িয়ে ১০ কিমি সার্চ করার লজিক ট্র্রিগার করা বা কাস্টমারকে "No Provider Available" নোটিফিকেশন দেওয়া।
- **Socket Session Recovery**: কাস্টমার বা প্রোভাইডারের ইন্টারনেট কানেকশন ড্রপ করলে ১০ মিনিটের মধ্যে পুনঃসংযোগের সেশন রিকভারি।

---

## 6. Verification & Load Testing Plan
- Redis `GEOSEARCH` পারফরম্যান্স বেঞ্চমার্ক টেস্ট।
- `artillery` বা `socket.io-client` স্ক্রিপ্ট ব্যবহার করে ১০০+ ড্রাইভার লোকেশন পলিং ব্যাকগ্রাউন্ডে সাইমুলেট করে টেস্ট করা।
