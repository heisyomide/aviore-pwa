'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSocket } from '@/src/app/communication/socket/socket';

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderRole: 'CUSTOMER' | 'RIDER' | 'ADMIN';
  text: string;
  timestamp: string;
}

export const getAuthToken = (): string => {
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem('rider_token') ||
    localStorage.getItem('aviore_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    ''
  );
};

// Helper to resolve user ID safely upfront
const getStoredUserId = (): string => {
  if (typeof window === 'undefined') return '';
  let resolvedUserId = 
    localStorage.getItem('userId') ||
    localStorage.getItem('riderId') ||
    localStorage.getItem('user_id') ||
    '';

  if (!resolvedUserId) {
    try {
      const userObj = JSON.parse(
        localStorage.getItem('user') || 
        localStorage.getItem('rider') || 
        localStorage.getItem('profile') || 
        '{}'
      );
      resolvedUserId = userObj?._id || userObj?.id || userObj?.userId || '';
    } catch (e) {
      // Fallback gracefully
    }
  }
  return resolvedUserId;
};

interface UseChatRoomOptions {
  jobId: string;
  fetchShipment: () => Promise<{
    otherUserId: string;
    otherUserName: string;
  }>;
}

export function useChatRoom({ jobId, fetchShipment }: UseChatRoomOptions) {
  // Initialize state directly from storage function to prevent empty-string initial render flash
  const [currentUserId, setCurrentUserId] = useState<string>(getStoredUserId);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  const [otherUserId, setOtherUserId] = useState<string>('');
  const [otherUserName, setOtherUserName] = useState<string>('User');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  const stableFetchShipment = useCallback(fetchShipment, [jobId]);

  // Keep user ID synced if updated
  useEffect(() => {
    const uid = getStoredUserId();
    if (uid && uid !== currentUserId) {
      setCurrentUserId(uid);
    }
  }, [currentUserId]);

  useEffect(() => {
    let isMounted = true;

    if (!jobId || jobId === 'undefined' || jobId === 'null') {
      setIsLoading(false);
      return;
    }

    async function init() {
      try {
        setIsLoading(true);
        setError(null);

        const token = getAuthToken();
        if (!token) {
          throw new Error('Authentication token is missing. Please log in again.');
        }

        const shipmentMeta = await stableFetchShipment();
        if (!isMounted) return;

        setOtherUserId(shipmentMeta.otherUserId);
        setOtherUserName(shipmentMeta.otherUserName);

        const socket = getSocket(token);
        socketRef.current = socket;

        if (!socket.connected) {
          socket.connect();
        }

        const onConnect = () => {
          if (!isMounted) return;
          setIsConnected(true);
          socket.emit('join_job_room', { jobId });
        };

        const onDisconnect = () => {
          if (!isMounted) return;
          setIsConnected(false);
        };

        const onConnectError = (err: Error) => {
          if (!isMounted) return;
          setError(`Socket connection error: ${err.message}`);
        };

        const onChatHistory = (history: ChatMessage[]) => {
          if (!isMounted) return;
          setMessages(history || []);
        };

        const onReceiveMessage = (msg: ChatMessage) => {
          if (!isMounted) return;
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          );
        };

        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('connect_error', onConnectError);
        socket.off('chat_history', onChatHistory);
        socket.off('receive_message', onReceiveMessage);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);
        socket.on('chat_history', onChatHistory);
        socket.on('receive_message', onReceiveMessage);

        if (socket.connected) {
          onConnect();
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || 'Unable to establish secure channel.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('connect_error');
        socketRef.current.off('chat_history');
        socketRef.current.off('receive_message');
      }
    };
  }, [jobId, stableFetchShipment]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !socketRef.current?.connected) return;

    socketRef.current.emit('send_message', { jobId, text: text.trim() });
    setInputMessage('');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    socketRef,
    currentUserId,
    isConnected,
    messages,
    inputMessage,
    setInputMessage,
    otherUserId,
    otherUserName,
    isLoading,
    error,
    chatBottomRef,
    handleSendMessage,
    formatTimer,
  };
}