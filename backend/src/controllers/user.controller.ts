import { Response } from 'express';
import { db } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { KycStatus } from '@prisma/client';

export const getMyProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      customerProfile: true,
      providerProfile: { include: { categories: true } },
      wallet: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }

  res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
});

export const submitKyc = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { nationalIdNo, kycDocUrls } = req.body;

  if (!nationalIdNo || !kycDocUrls || kycDocUrls.length === 0) {
    throw new ApiError(400, 'nationalIdNo and kycDocUrls are required');
  }

  const updatedProfile = await db.providerProfile.update({
    where: { userId },
    data: {
      nationalIdNo,
      kycDocUrls,
      kycStatus: KycStatus.PENDING,
    },
  });

  res.status(200).json(new ApiResponse(200, updatedProfile, 'KYC submitted successfully. Awaiting admin review.'));
});

export const getPendingKycProviders = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const providers = await db.providerProfile.findMany({
    where: { kycStatus: KycStatus.PENDING },
    include: { user: true, categories: true },
  });

  res.status(200).json(new ApiResponse(200, providers, 'Pending KYC providers fetched'));
});

export const verifyProviderKyc = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { providerProfileId } = req.params;
  const { approved, rejectionReason } = req.body;

  const status = approved ? KycStatus.APPROVED : KycStatus.REJECTED;

  const updatedProfile = await db.providerProfile.update({
    where: { id: providerProfileId },
    data: {
      kycStatus: status,
      kycRejectionReason: approved ? null : rejectionReason || 'KYC documents invalid',
    },
  });

  res.status(200).json(new ApiResponse(200, updatedProfile, `Provider KYC status updated to ${status}`));
});
