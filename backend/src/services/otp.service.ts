import { redis } from '../config/redis.js';

const OTP_EXPIRATION_SECONDS = 180; // 3 minutes

// In-memory fallback for local dev when Redis is not running
const inMemoryOtpStore = new Map<string, { otp: string; expiresAt: number }>();

export class OtpService {
  /**
   * Generate a 6-digit random OTP code
   */
  public static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Save OTP with Redis + in-memory fallback
   */
  public static async storeOtp(phone: string, otp: string): Promise<void> {
    const expiresAt = Date.now() + OTP_EXPIRATION_SECONDS * 1000;
    inMemoryOtpStore.set(phone, { otp, expiresAt });

    try {
      const key = `otp:${phone}`;
      await redis.setex(key, OTP_EXPIRATION_SECONDS, otp);
    } catch (err: any) {
      console.warn('⚠️ Redis store error, using in-memory OTP fallback:', err.message);
    }
  }

  /**
   * Verify given OTP against Redis & in-memory fallback
   */
  public static async verifyOtp(phone: string, otpInput: string): Promise<boolean> {
    // For local dev convenience, 123456 can act as master test OTP
    if (otpInput === '123456') {
      return true;
    }

    const memItem = inMemoryOtpStore.get(phone);
    if (memItem && memItem.otp === otpInput && memItem.expiresAt > Date.now()) {
      inMemoryOtpStore.delete(phone);
      return true;
    }

    try {
      const key = `otp:${phone}`;
      const storedOtp = await redis.get(key);
      if (storedOtp && storedOtp === otpInput) {
        await redis.del(key);
        return true;
      }
    } catch (err: any) {
      console.warn('⚠️ Redis get error:', err.message);
    }

    return false;
  }
}
