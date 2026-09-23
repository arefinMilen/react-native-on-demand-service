import { Server, Socket } from 'socket.io';
import { LocationService } from '../services/location.service.js';
import { db } from '../config/db.js';
import { BookingStatus } from '@prisma/client';

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 [Socket Connected] Socket ID: ${socket.id}`);

    // Join User/Provider specific room
    socket.on('join_room', (data: { userId: string; role: string }) => {
      const roomName = data.role === 'PROVIDER' ? `provider_${data.userId}` : `user_${data.userId}`;
      socket.join(roomName);
      console.log(`👤 Socket ${socket.id} joined room: ${roomName}`);
    });

    // Provider location streaming update
    socket.on(
      'provider_location_update',
      async (data: { providerId: string; categoryId: string; latitude: number; longitude: number }) => {
        const { providerId, categoryId, latitude, longitude } = data;
        if (providerId && categoryId && latitude !== undefined && longitude !== undefined) {
          await LocationService.updateProviderLocation(providerId, categoryId, {
            latitude,
            longitude,
          });

          // Also broadcast to any customer tracking this active provider
          io.emit(`provider_live_location:${providerId}`, { latitude, longitude });
        }
      }
    );

    // Provider Accept Job Event
    socket.on('accept_job', async (data: { bookingId: string; providerId: string }) => {
      const { bookingId, providerId } = data;

      try {
        const booking = await db.booking.findUnique({ where: { id: bookingId } });

        if (!booking || booking.status !== BookingStatus.SEARCHING_PROVIDER) {
          socket.emit('job_accept_failed', {
            bookingId,
            message: 'This job offer is no longer available or was taken by another provider.',
          });
          return;
        }

        // Atomic update to ACCEPTED status
        const updatedBooking = await db.booking.update({
          where: { id: bookingId },
          data: {
            providerId,
            status: BookingStatus.ACCEPTED,
          },
          include: {
            provider: { include: { providerProfile: true } },
            service: true,
          },
        });

        // Notify provider of success
        socket.emit('job_accepted_success', { booking: updatedBooking });

        // Notify customer that provider was assigned!
        io.to(`user_${booking.customerId}`).emit('provider_assigned', {
          booking: updatedBooking,
          provider: updatedBooking.provider?.providerProfile,
        });

        console.log(`✅ [Job Accepted] Booking ${bookingId} assigned to Provider ${providerId}`);
      } catch (err: any) {
        console.error('Error accepting job:', err.message);
        socket.emit('job_accept_failed', { bookingId, message: 'Server error accepting job' });
      }
    });

    // Provider Reject Job Event
    socket.on('reject_job', (data: { bookingId: string; providerId: string }) => {
      console.log(`❌ Provider ${data.providerId} rejected job ${data.bookingId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [Socket Disconnected] ${socket.id}`);
    });
  });
};
