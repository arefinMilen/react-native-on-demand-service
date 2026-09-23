import { Request, Response } from 'express';
import { db } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await db.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, iconUrl, basePrice, hourlyRate, commissionPercent } = req.body;

  if (!name || basePrice === undefined) {
    throw new ApiError(400, 'Name and basePrice are required');
  }

  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const existing = await db.serviceCategory.findUnique({ where: { slug } });
  if (existing) {
    throw new ApiError(400, 'Category with this name already exists');
  }

  const category = await db.serviceCategory.create({
    data: {
      name,
      slug,
      description,
      iconUrl,
      basePrice: parseFloat(basePrice),
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
      commissionPercent: commissionPercent ? parseFloat(commissionPercent) : 10.0,
    },
  });

  res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});
