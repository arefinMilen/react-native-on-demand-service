import { Router } from 'express';
import { getMyProfile, submitKyc, getPendingKycProviders, verifyProviderKyc } from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/profile', requireAuth, getMyProfile);
router.patch('/kyc-submit', requireAuth, requireRole([Role.PROVIDER]), submitKyc);
router.get('/admin/kyc-pending', requireAuth, requireRole([Role.ADMIN]), getPendingKycProviders);
router.patch('/admin/kyc-verify/:providerProfileId', requireAuth, requireRole([Role.ADMIN]), verifyProviderKyc);

export default router;
