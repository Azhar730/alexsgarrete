import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const auth = useSelector((state: RootState) => state.auth);
  const token = auth?.token;

  useEffect(() => {
    // We allow connection even without token if cookies are available (handled by backend)
    // But we need a trigger. Let's use the presence of 'auth' or just run once.
    
    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_API_URL?.trim() ||
      process.env.NEXT_PUBLIC_BASE_API?.trim() ||
      'http://localhost:3030';
    const socketInstance = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ['polling', 'websocket'], // Allow fallback
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
    });

    socketInstance.on('connect_error', (err) => {
      console.error('User socket connection error:', err.message);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return socket;
};
