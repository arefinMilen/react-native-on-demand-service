# Phase 3: Customer Mobile App (React Native)

## 1. Objective
কাস্টমারদের জন্য একটি রিচ, রেসপন্সিভ এবং আধুনিক রিয়েল-টাইম মোবাইল অ্যাপ্লিকেশন তৈরি করা (Android & iOS) যা দিয়ে সহজেই সার্ভিস সার্চ, বুকিং, লাইভ প্রোভাইডার ট্র্যাকিং এবং ডিজিটাল পেমেন্ট সম্পন্ন করা যাবে।

---

## 2. Tech Stack & Key Libraries

- **Framework**: React Native (Expo SDK 50+ / React Native CLI)
- **State Management**: Redux Toolkit (Global UI/Auth state) + React Query (API Caching)
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **Maps & Location**: `react-native-maps`, `expo-location`
- **Real-Time Websocket**: `socket.io-client`
- **UI & Animations**: React Native Paper / Restyle, `react-native-reanimated`, `lucide-react-native`
- **Form Handling**: React Hook Form + Zod validation

---

## 3. App Architecture & Folder Structure

```
apps/customer-app/
├── src/
│   ├── assets/              # Icons, Images, Fonts
│   ├── components/          # Reusable UI (Buttons, Cards, Modals, Inputs)
│   ├── navigation/          # AuthStack, MainTabNavigator, BookingStack
│   ├── screens/
│   │   ├── auth/            # LoginScreen, OtpScreen, RegisterScreen
│   │   ├── home/            # HomeScreen, CategoryListScreen, ServiceDetailScreen
│   │   ├── booking/         # LocationPickerScreen, CheckoutScreen, SearchingProviderScreen
│   │   ├── tracking/        # LiveTrackingScreen, ChatScreen
│   │   └── profile/         # ProfileScreen, BookingHistoryScreen, RatingModal
│   ├── services/            # API Clients (Axios), SocketService, LocationService
│   ├── store/               # Redux Slices (authSlice, bookingSlice, locationSlice)
│   └── utils/               # Map Helpers, Date Formatter, Currency Formatter
├── App.tsx
└── app.json
```

---

## 4. Key UI Screens & User Flow Specification

### A. Auth Flow
1. **LoginScreen**: মোবাইল নম্বর দেওয়ার ইনপুট ফিল্ড + "Get OTP" বাটন।
2. **OtpScreen**: ৪/৬ ডিজিটের অটো-রিড ওটিপি ইনপুট ফিল্ড এবং ৩ মিনিটে কাউন্টডাউন টাইমার।
3. **RegisterScreen**: নাম, ইমেইল এবং প্রোফাইল পিকচার আপলোড ফিল্ড।

### B. Discovery & Booking Flow
1. **HomeScreen**: 
   - টপ বার: কারেন্ট অ্যাড্রেস সিলেক্টর।
   - সার্চ বার: সার্ভিস সার্চ (e.g. "Plumber", "AC Repair", "Doctor").
   - ব্যানার স্লাইডার: অফার/প্রোমো কোড।
   - ক্যাটাগরি গ্রিড (Icons with vibrant colors).
2. **ServiceDetailScreen**:
   - সার্ভিস বর্ণনা, বেস প্রাইস, ঘন্টা প্রতি রেট ও রিভিউ সামারি।
3. **LocationPickerScreen**:
   - Google Maps ইন্টিগ্রেশন + Pin dragging facility + Google Places Autocomplete API search bar.
4. **Checkout & PaymentScreen**:
   - টোটাল অ্যামাউন্ট ব্রেকডাউন (Base fee + Surge pricing + Tax).
   - পেমেন্ট মেথড সিলেকশন (Cash, bKash, Nagad, Card).
   - "Confirm Booking" বাটন চাপলে Searching Screen এ রিডাইরেক্ট করা।

### C. Real-Time Tracking & Live Job Order Flow
1. **SearchingProviderScreen**:
   - রাডার পালস অ্যানিমেশন সহ "Searching for nearby providers..." ডায়ালগ।
   - ৩০-৬০ সেকেন্ডের ওয়েটিং ব্যাকগ্রাউন্ড সকেট লিসেনার।
2. **LiveTrackingScreen**:
   - ম্যাপ মডিউল: ড্রাইভার/প্রোভাইডারের রিয়েল-টাইম GPS মার্কার আপডেট (Smooth Animated Marker).
   - প্রোভাইডার কার্ড: প্রোভাইডারের ছবি, নাম, রেটিং, গাড়ি/টুলস ডিটেইলস, কল বাটন, ইন-অ্যাপ চ্যাট বাটন।
   - জব স্ট্যাটাস ব্যাজ: `Accepted` -> `Provider Arrived` -> `Service Started` -> `Completed`.
3. **Rating & Review Modal**:
   - কাজ শেষ হওয়ার পর স্টার রেটিং (1-5 stars) এবং লিখিত কমেন্ট ইনপুট বক্স।

---

## 5. Key Technical Implementation Steps

1. Redux Toolkit integration: Auth state, current booking object, global loading overlay.
2. Socket.io Client Wrapper: অ্যাপ ব্যাকগ্রাউন্ড ও ফরগ্রাউন্ড হ্যান্ডলিং সহ সকেট ইভেন্ট রিকানেকশন।
3. Custom Map Marker Component: `react-native-maps` এর মার্কার এনিমেশন (Interpolation between lat/lng points for smooth provider motion).
4. FCM Push Notification handler: অ্যাপ ব্যাকগ্রাউন্ডে থাকলে নোটিফিকেশন রিসিভ করে নির্দিষ্ট ট্র্যাকিং স্ক্রিনে নেভিগেট করানো।
