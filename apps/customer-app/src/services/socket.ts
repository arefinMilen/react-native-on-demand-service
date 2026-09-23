import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

let socket: Socket | null = null;

export const initCustomerSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('🔌 Connected to Socket server:', socket?.id);
      socket?.emit('join_room', { userId, role: 'CUSTOMER' });
    });
  }
  return socket;
};

export const getCustomerSocket = (): Socket | null => socket;

export const disconnectCustomerSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
