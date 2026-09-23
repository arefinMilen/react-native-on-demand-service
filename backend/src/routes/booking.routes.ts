import { Router } from 'express';
import { createBooking, getMyBookings, getBookingById } from '../controllers/booking.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/my-bookings', requireAuth, getMyBookings);
router.get('/:id', requireAuth, getBookingById);

export default router;
