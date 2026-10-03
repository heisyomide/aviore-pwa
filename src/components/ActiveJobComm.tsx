'use client';

import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Phone, PhoneOff, Send, Mic, MicOff, X } from 'lucide-react';

interface ActiveJobCommProps {
  jobId: string;
  userId: string;
  recipientId: string; // The Sender ID (if user is Rider) or Rider ID (if user is Sender)
  callerName: string;
  role: 'RIDER' | 'CUSTOMER';
  socketUrl?: string;
  onClose?: () => void;
}

export default function ActiveJobComm({
  jobId,
  userId,
  recipientId,
  callerName,
  role,
  socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000/job-comm',
  onClose,
}: ActiveJobCommProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Array<{ senderId: string; text: string; timestamp: string }>>([]);
  const [inputText, setInputText] = useState('');

  // Call states
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ offer: any; fromSocketId: string; callerName: string } | null>(null);
  const [targetSocketId, setTargetSocketId] = useState<string | null>(null);

  // WebRTC Refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const newSocket = io(socketUrl, { transports: ['websocket'] });

    newSocket.on('connect', () => {
      newSocket.emit('join_job_room', { jobId, userId, role });
    });

    newSocket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on('incoming_call', (data) => {
      setIncomingCall(data);
    });

    newSocket.on('call_accepted', async (data) => {
      setInCall(true);
      setTargetSocketId(data.fromSocketId);
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    newSocket.on('ice_candidate', async (data) => {
      if (peerConnectionRef.current && data.candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    newSocket.on('call_ended', () => {
      cleanupCall();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [jobId, userId, role, socketUrl]);

  // WebRTC Setup
  const createPeer = (socketInst: Socket, target?: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketInst.emit('ice_candidate', { jobId, targetSocketId: target, candidate: e.candidate });
      }
    };

    pc.ontrack = (e) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = e.streams[0];
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const startCall = async () => {
    if (!socket) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      const pc = createPeer(socket);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('call_user', { jobId, recipientId, offer, callerName });
      setInCall(true);
    } catch (err) {
      alert('Could not access microphone for in-app call.');
    }
  };

  const answerCall = async () => {
    if (!socket || !incomingCall) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      const pc = createPeer(socket, incomingCall.fromSocketId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('answer_call', { toSocketId: incomingCall.fromSocketId, answer });
      setInCall(true);
      setIncomingCall(null);
    } catch (err) {
      console.error(err);
    }
  };

  const endCall = () => {
    if (socket) socket.emit('end_call', { jobId });
    cleanupCall();
  };

  const cleanupCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    setInCall(false);
    setIncomingCall(null);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !socket) return;
    socket.emit('send_message', {
      jobId,
      senderId: userId,
      recipientId,
      text: inputText,
      senderRole: role,
    });
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[520px] w-full max-w-md bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden font-sans">
      <audio ref={remoteAudioRef} autoPlay />

      {/* Header */}
      <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider">
            {role === 'RIDER' ? 'Chat with Sender' : 'Chat with Rider'}
          </h3>
          <p className="text-[10px] font-mono text-neutral-400">Order #{jobId.slice(-6)}</p>
        </div>

        <div className="flex items-center gap-2">
          {!inCall ? (
            <button
              onClick={startCall}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition text-white flex items-center gap-1.5 text-xs font-bold"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </button>
          ) : (
            <button
              onClick={endCall}
              className="p-2.5 bg-rose-600 hover:bg-rose-500 rounded-xl transition text-white flex items-center gap-1.5 text-xs font-bold"
            >
              <PhoneOff className="w-3.5 h-3.5" /> End
            </button>
          )}

          {onClose && (
            <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Incoming Call Notification */}
      {incomingCall && (
        <div className="bg-amber-500 text-white p-3 flex items-center justify-between text-xs font-bold animate-pulse">
          <span>{incomingCall.callerName} is calling...</span>
          <div className="flex gap-2">
            <button onClick={answerCall} className="px-3 py-1 bg-emerald-700 rounded-lg text-white">
              Answer
            </button>
            <button onClick={() => setIncomingCall(null)} className="px-3 py-1 bg-neutral-900 rounded-lg text-white">
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Chat History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50">
        {messages.length === 0 ? (
          <div className="text-center text-neutral-400 text-xs py-10 font-medium">
            No messages yet. Send a message to get in touch.
          </div>
        ) : (
          messages.map((m, idx) => {
            const isMe = m.senderId === userId;
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[78%] p-3 rounded-2xl text-xs ${
                    isMe
                      ? 'bg-neutral-900 text-white rounded-br-none'
                      : 'bg-white border border-neutral-200 text-neutral-900 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-neutral-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-neutral-100 text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-neutral-900 transition"
        />
        <button
          onClick={sendMessage}
          className="p-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}