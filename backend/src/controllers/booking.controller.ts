import { Response } from 'express';
import { db } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { BookingStatus, PaymentMethod } from '@prisma/client';

export const createBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const customerId = req.user?.userId;
  const { serviceId, pickupLat, pickupLng, addressText, notes, paymentMethod } = req.body;

  if (!serviceId || pickupLat === undefined || pickupLng === undefined || !addressText) {
    throw new ApiError(400, 'serviceId, pickupLat, pickupLng, and addressText are required');
  }

  const category = await db.serviceCategory.findUnique({ where: { id: serviceId } });
  if (!category) {
    throw new ApiError(404, 'Service category not found');
  }

  const totalAmount = category.basePrice;
  const commissionAmount = (totalAmount * category.commissionPercent) / 100;
  const providerEarnings = totalAmount - commissionAmount;

  const bookingNumber = `BK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const booking = await db.booking.create({
    data: {
      bookingNumber,
      customerId: customerId!,
      serviceId,
      pickupLat: parseFloat(pickupLat),
      pickupLng: parseFloat(pickupLng),
      addressText,
      notes,
      totalAmount,
      commissionAmount,
      providerEarnings,
      paymentMethod: paymentMethod || PaymentMethod.CASH,
      status: BookingStatus.REQUESTED,
    },
    include: {
      service: true,
      customer: { include: { customerProfile: true } },
    },
  });

  res.status(201).json(new ApiResponse(201, booking, 'Booking created successfully'));
});

export const getMyBookings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  const whereClause = role === 'PROVIDER' ? { providerId: userId } : { customerId: userId };

  const bookings = await db.booking.findMany({
    where: whereClause,
    include: {
      service: true,
      customer: { include: { customerProfile: true } },
      provider: { include: { providerProfile: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(new ApiResponse(200, bookings, 'Bookings fetched successfully'));
});

export const getBookingById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      service: true,
      customer: { include: { customerProfile: true } },
      provider: { include: { providerProfile: true } },
      review: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  res.status(200).json(new ApiResponse(200, booking, 'Booking details fetched'));
});

export const getAllBookings = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const bookings = await db.booking.findMany({
    include: {
      service: true,
      customer: { include: { customerProfile: true } },
      provider: { include: { providerProfile: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(new ApiResponse(200, bookings, 'All platform bookings fetched'));
});
