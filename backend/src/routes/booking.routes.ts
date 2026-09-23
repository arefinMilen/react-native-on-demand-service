import { Router } from 'express';
import { createBooking, getMyBookings, getBookingById, getAllBookings } from '../controllers/booking.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllBookings);
router.post('/', requireAuth, createBooking);
router.get('/my-bookings', requireAuth, getMyBookings);
router.get('/:id', requireAuth, getBookingById);

export default router;
