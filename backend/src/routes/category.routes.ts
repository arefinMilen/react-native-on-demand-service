import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/category.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', getCategories);
router.post('/', requireAuth, requireRole([Role.ADMIN]), createCategory);

export default router;
