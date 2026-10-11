import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ENV } from '@/lib/env';
import type { DeliveryMessage } from '@/types';

// Extract base URL from API URL (e.g., 'http://localhost:3000/api' -> 'http://localhost:3000')
const SOCKET_URL = ENV.apiUrl.replace(/\/api\/?$/, '');

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
    });
  }
  return socketInstance;
}

export interface UseChatSocketReturn {
  socket: Socket;
  isConnected: boolean;
  joinThread: (threadId: string) => void;
  leaveThread: (threadId: string) => void;
  sendRealtimeMessage: (payload: { threadId: string; text: string; sender?: 'user' | 'peer' | 'system' }) => void;
  sendTypingStatus: (threadId: string, isTyping: boolean) => void;
}

export function useChatSocket(
  threadId: string,
  onMessageReceived?: (message: DeliveryMessage) => void,
): UseChatSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const onMessageRef = useRef(onMessageReceived);
  onMessageRef.current = onMessageReceived;

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    if (socket.connected) setIsConnected(true);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Join thread channel
    if (threadId) {
      socket.emit('join_thread', { threadId });
    }

    // Listen for incoming real-time messages
    const handleReceiveMessage = (data: { id?: string; threadId: string; sender?: 'user' | 'peer' | 'system'; text: string; at?: string }) => {
      if (data.threadId === threadId && onMessageRef.current) {
        const msg: DeliveryMessage = {
          id: data.id || `msg-${Date.now()}`,
          sender: data.sender || 'peer',
          text: data.text,
          at: data.at || new Date().toISOString(),
        };
        onMessageRef.current(msg);
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      if (threadId) {
        socket.emit('leave_thread', { threadId });
      }
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [threadId]);

  const joinThread = (id: string) => {
    getSocket().emit('join_thread', { threadId: id });
  };

  const leaveThread = (id: string) => {
    getSocket().emit('leave_thread', { threadId: id });
  };

  const sendRealtimeMessage = (payload: { threadId: string; text: string; sender?: 'user' | 'peer' | 'system' }) => {
    const socket = getSocket();
    socket.emit('send_message', {
      threadId: payload.threadId,
      text: payload.text,
      sender: payload.sender || 'user',
      at: new Date().toISOString(),
    });
  };

  const sendTypingStatus = (id: string, isTyping: boolean) => {
    getSocket().emit('typing_status', { threadId: id, isTyping });
  };

  return {
    socket: getSocket(),
    isConnected,
    joinThread,
    leaveThread,
    sendRealtimeMessage,
    sendTypingStatus,
  };
}
