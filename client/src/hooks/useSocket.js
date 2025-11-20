import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const resolveSocketBase = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace('/api', '');
};

const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);
  const baseUrl = useMemo(resolveSocketBase, []);

  useEffect(() => {
    const socket = io(baseUrl, {
      transports: ['websocket'],
    });

    socketRef.current = socket;
    setSocketInstance(socket);

    if (user?._id) {
      socket.emit('registerUser', user._id);
    }

    return () => {
      socket.disconnect();
      setSocketInstance(null);
    };
  }, [baseUrl, user?._id]);

  const joinProductRoom = useCallback((productId) => {
    socketRef.current?.emit('joinProductRoom', productId);
  }, []);

  const leaveProductRoom = useCallback((productId) => {
    socketRef.current?.emit('leaveProductRoom', productId);
  }, []);

  return { socket: socketInstance, joinProductRoom, leaveProductRoom };
};

export default useSocket;

