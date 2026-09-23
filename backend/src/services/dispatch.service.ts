import { io } from '../server.js';
import { db } from '../config/db.js';
import { LocationService } from './location.service.js';
import { BookingStatus } from '@prisma/client';

export class DispatchService {
  /**
   * Find nearby online providers and emit new_job_offer socket event
   */
  public static async dispatchBookingToProviders(bookingId: string): Promise<boolean> {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        customer: { include: { customerProfile: true } },
      },
    });

    if (!booking || booking.status !== BookingStatus.REQUESTED) {
      return false;
    }

    // Update status to SEARCHING_PROVIDER
    await db.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.SEARCHING_PROVIDER },
    });

    const nearbyProviders = await LocationService.findNearbyProviders(
      booking.serviceId,
      { latitude: booking.pickupLat, longitude: booking.pickupLng },
      5, // 5km radius
      5  // Top 5 nearest providers
    );

    if (nearbyProviders.length === 0) {
      console.log(`⚠️ No active providers found within 5km for booking ${bookingId}`);
      // Notify customer that searching is taking longer or expanded
      io.to(`user_${booking.customerId}`).emit('search_status_update', {
        bookingId,
        message: 'Searching in wider radius...',
      });
      return false;
    }

    // Broadcast new_job_offer event to matching provider socket rooms
    nearbyProviders.forEach(({ providerId, distanceKm }) => {
      io.to(`provider_${providerId}`).emit('new_job_offer', {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        serviceTitle: booking.service.name,
        customerName: booking.customer.customerProfile?.fullName || 'Customer',
        addressText: booking.addressText,
        pickupLat: booking.pickupLat,
        pickupLng: booking.pickupLng,
        totalAmount: booking.totalAmount,
        providerEarnings: booking.providerEarnings,
        distanceKm,
        expiresInSeconds: 30,
      });
    });

    return true;
  }
}
