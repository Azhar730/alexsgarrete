import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const auth = useSelector((state: any) => state.auth);
  const token = auth?.token;

  useEffect(() => {
    // We allow connection even without token if cookies are available (handled by backend)
    // But we need a trigger. Let's use the presence of 'auth' or just run once.
    
    const socketUrl = process.env.NEXT_PUBLIC_BASE_API?.trim() || 'http://localhost:51212';
    const socketInstance = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ['polling', 'websocket'], // Allow fallback
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('User connected to socket server');
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
