import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

let socket: Socket | null = null;

export const initProviderSocket = (providerId: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('🔌 [Provider App] Socket connected:', socket?.id);
      socket?.emit('join_room', { userId: providerId, role: 'PROVIDER' });
    });
  }
  return socket;
};

export const getProviderSocket = (): Socket | null => socket;

export const emitLocationUpdate = (
  providerId: string,
  categoryId: string,
  latitude: number,
  longitude: number
) => {
  if (socket) {
    socket.emit('provider_location_update', {
      providerId,
      categoryId,
      latitude,
      longitude,
    });
  }
};
