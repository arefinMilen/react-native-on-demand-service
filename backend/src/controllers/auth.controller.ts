import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { OtpService } from '../services/otp.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { Role } from '@prisma/client';

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) {
    throw new ApiError(400, 'Phone number is required');
  }

  const otp = OtpService.generateOtp();
  await OtpService.storeOtp(phone, otp);

  // In production, integrate SMS Gateway (Twilio / SSL Wireless) here
  console.log(`📱 [OTP SENT] Phone: ${phone} | Code: ${otp}`);

  res.status(200).json(
    new ApiResponse(
      200,
      { phone, expiresIn: '3 minutes', testOtpHint: '123456 or see server logs' },
      'OTP sent successfully'
    )
  );
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    throw new ApiError(400, 'Phone number and OTP are required');
  }

  const isValid = await OtpService.verifyOtp(phone, otp);
  if (!isValid) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { phone },
    include: { customerProfile: true, providerProfile: true },
  });

  if (!existingUser) {
    return res.status(200).json(
      new ApiResponse(
        200,
        { isRegistered: false, phone },
        'OTP verified. Please complete registration.'
      )
    );
  }

  const accessToken = generateAccessToken({
    userId: existingUser.id,
    phone: existingUser.phone,
    role: existingUser.role,
  });

  const refreshToken = generateRefreshToken({
    userId: existingUser.id,
    phone: existingUser.phone,
    role: existingUser.role,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        isRegistered: true,
        user: existingUser,
        accessToken,
        refreshToken,
      },
      'Authentication successful'
    )
  );
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { phone, fullName, email, role, password, address, categories } = req.body;

  if (!phone || !fullName || !role) {
    throw new ApiError(400, 'Phone, fullName, and role are required');
  }

  const existingUser = await db.user.findUnique({ where: { phone } });
  if (existingUser) {
    throw new ApiError(400, 'User with this phone number already exists');
  }

  const passwordHash = password ? await bcrypt.hash(password, 10) : null;
  const userRole = role === 'PROVIDER' ? Role.PROVIDER : Role.CUSTOMER;

  const newUser = await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        phone,
        email: email || null,
        passwordHash,
        role: userRole,
        wallet: {
          create: { balance: 0.0 },
        },
      },
    });

    if (userRole === Role.CUSTOMER) {
      await tx.customerProfile.create({
        data: {
          userId: user.id,
          fullName,
          address: address || null,
        },
      });
    } else if (userRole === Role.PROVIDER) {
      await tx.providerProfile.create({
        data: {
          userId: user.id,
          fullName,
          categories: categories && categories.length > 0 ? {
            connect: categories.map((catId: string) => ({ id: catId })),
          } : undefined,
        },
      });
    }

    return user;
  });

  const fullUserData = await db.user.findUnique({
    where: { id: newUser.id },
    include: { customerProfile: true, providerProfile: true, wallet: true },
  });

  const accessToken = generateAccessToken({
    userId: newUser.id,
    phone: newUser.phone,
    role: newUser.role,
  });

  const refreshToken = generateRefreshToken({
    userId: newUser.id,
    phone: newUser.phone,
    role: newUser.role,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      { user: fullUserData, accessToken, refreshToken },
      'User registered successfully'
    )
  );
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await db.user.findUnique({ where: { id: decoded.userId } });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const newAccessToken = generateAccessToken({
    userId: user.id,
    phone: user.phone,
    role: user.role,
  });

  res.status(200).json(
    new ApiResponse(200, { accessToken: newAccessToken }, 'Access token refreshed')
  );
});
