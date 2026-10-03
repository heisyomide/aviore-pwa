import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (token: string): Socket => {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const baseUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  const namespaceUrl = `${baseUrl}/job-comm`;

  console.log('[SOCKET_CLIENT] Getting socket instance for:', namespaceUrl);

  if (!socket) {
    console.log('[SOCKET_CLIENT] Initializing brand new global socket instance.');
    socket = io(namespaceUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      auth: { token },
    });
  } else {
    // Update token dynamically if needed
    socket.auth = { token };
    if (!socket.connected) {
      console.log('[SOCKET_CLIENT] Socket instance exists but disconnected. Reconnecting...');
      socket.connect();
    }
  }

  return socket;
};

export const disconnectSocket = () => {
  // NO-OP or safe check: Prevent individual components from destroying 
  // the global socket connection stream prematurely.
  console.log('[SOCKET_CLIENT] disconnectSocket requested (safely ignored to preserve stream persistence).');
};