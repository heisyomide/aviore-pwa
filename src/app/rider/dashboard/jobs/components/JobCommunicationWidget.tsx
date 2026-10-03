'use client';

import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Send, 
  X, 
  MessageSquare, 
  ShieldAlert,
  Volume2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: 'RIDER' | 'CUSTOMER';
  text: string;
  timestamp: string;
}

interface Props {
  jobId: string;
  currentUserId: string;
  currentUserRole: 'RIDER' | 'CUSTOMER';
  peerName: string; // e.g. "Rider: Chidi" or "Customer: Amaka"
  isOpen: boolean;
  onClose: () => void;
  onOpenDispute: () => void;
  socketUrl?: string;
}

// Free Google STUN Servers
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function JobCommunicationWidget({
  jobId,
  currentUserId,
  currentUserRole,
  peerName,
  isOpen,
  onClose,
  onOpenDispute,
  socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'
}: Props) {
  // Socket & Chat state
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // WebRTC Audio Call state
  const [callStatus, setCallStatus] = useState<'IDLE' | 'RINGING_OUT' | 'RINGING_IN' | 'CONNECTED'>('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callerSocketIdRef = useRef<string | null>(null);
  const incomingOfferRef = useRef<any>(null);

  // 1. Initialize Socket Connection & Listeners
  useEffect(() => {
    if (!isOpen) return;

    const socket = io(`${socketUrl}/job-comm`, {
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_job_room', { jobId, userId: currentUserId, role: currentUserRole });
    });

    // Receive Chat Message
    socket.on('receive_message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    // WebRTC Signaling Events
    socket.on('incoming_call', (data: { offer: any; fromSocketId: string; callerName: string }) => {
      callerSocketIdRef.current = data.fromSocketId;
      incomingOfferRef.current = data.offer;
      setCallStatus('RINGING_IN');
    });

    socket.on('call_accepted', async (data: { answer: any }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        setCallStatus('CONNECTED');
      }
    });

    socket.on('ice_candidate', async (data: { candidate: any }) => {
      if (peerConnectionRef.current && data.candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error('Error adding ICE candidate', e);
        }
      }
    });

    socket.on('call_ended', () => {
      cleanupCall();
    });

    return () => {
      cleanupCall();
      socket.disconnect();
    };
  }, [isOpen, jobId, currentUserId, currentUserRole, socketUrl]);

  // Clean up media streams and WebRTC peers
  const cleanupCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setCallStatus('IDLE');
    setIsMuted(false);
  };

  // Helper: Prepare PeerConnection
  const createPeerConnection = (targetSocketId?: string) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice_candidate', {
          jobId,
          targetSocketId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  // Start Voice Call
  const startCall = async () => {
    try {
      setCallStatus('RINGING_OUT');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socketRef.current?.emit('call_user', {
        jobId,
        offer,
        callerName: currentUserRole === 'RIDER' ? 'Rider' : 'Customer',
      });
    } catch (err) {
      console.error('Failed to get microphone permission:', err);
      alert('Microphone access is required to place in-app voice calls.');
      setCallStatus('IDLE');
    }
  };

  // Answer Call
  const answerCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      const pc = createPeerConnection(callerSocketIdRef.current || undefined);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(incomingOfferRef.current));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socketRef.current?.emit('answer_call', {
        toSocketId: callerSocketIdRef.current,
        answer,
      });

      setCallStatus('CONNECTED');
    } catch (err) {
      console.error('Failed to answer call:', err);
      cleanupCall();
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Hang Up Call
  const endCall = () => {
    socketRef.current?.emit('end_call', { jobId });
    cleanupCall();
  };

  // Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    socketRef.current?.emit('send_message', {
      jobId,
      senderId: currentUserId,
      senderRole: currentUserRole,
      text: inputMsg.trim(),
    });

    setInputMsg('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-zinc-200">
      {/* Hidden audio element for remote stream */}
      <audio ref={remoteAudioRef} autoPlay />

      {/* Header */}
      <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm">{peerName}</h3>
          <p className="text-xs text-zinc-400">Order ID: #{jobId.slice(-6)}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Call Trigger */}
          {callStatus === 'IDLE' && (
            <button
              onClick={startCall}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white transition"
              title="Start In-App Voice Call"
            >
              <Phone className="h-4 w-4" />
            </button>
          )}

          {/* Report Issue Button */}
          <button
            onClick={onOpenDispute}
            className="p-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 rounded-full transition"
            title="Report Issue / Dispute"
          >
            <ShieldAlert className="h-4 w-4" />
          </button>

          {/* Close Panel */}
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ACTIVE CALL OVERLAY */}
      {callStatus !== 'IDLE' && (
        <div className="bg-emerald-950 text-white p-4 flex flex-col items-center justify-center space-y-3 animate-fade-in border-b border-emerald-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Volume2 className="h-4 w-4 animate-pulse" />
            {callStatus === 'RINGING_OUT' && 'Calling...'}
            {callStatus === 'RINGING_IN' && 'Incoming Call...'}
            {callStatus === 'CONNECTED' && 'In-App Voice Call Active'}
          </div>

          <p className="text-sm font-medium">{peerName}</p>

          <div className="flex items-center gap-4 pt-1">
            {/* Incoming Call Options */}
            {callStatus === 'RINGING_IN' ? (
              <>
                <button
                  onClick={answerCall}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5"
                >
                  <Phone className="h-3.5 w-3.5" /> Answer
                </button>
                <button
                  onClick={endCall}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5"
                >
                  <PhoneOff className="h-3.5 w-3.5" /> Reject
                </button>
              </>
            ) : (
              <>
                {/* Mute Button */}
                <button
                  onClick={toggleMute}
                  className={`p-3 rounded-full text-xs font-bold transition ${
                    isMuted ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                {/* Hang Up Button */}
                <button
                  onClick={endCall}
                  className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition"
                >
                  <PhoneOff className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHAT MESSAGES BODY */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 space-y-2">
            <MessageSquare className="h-8 w-8 text-zinc-300" />
            <p className="text-xs">No messages yet. Send a message or call to coordinate delivery.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === currentUserRole;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs font-medium shadow-sm ${
                    isMe
                      ? 'bg-emerald-700 text-white rounded-br-none'
                      : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* QUICK PRESET RESPONSE CHIPS */}
      <div className="p-2 bg-white border-t border-zinc-100 flex gap-1.5 overflow-x-auto no-scrollbar">
        {currentUserRole === 'RIDER' ? (
          <>
            <button
              onClick={() => setInputMsg("I've arrived at the location.")}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-[11px] whitespace-nowrap transition"
            >
              📍 Arrived
            </button>
            <button
              onClick={() => setInputMsg('I am in traffic, will be 5 mins late.')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-[11px] whitespace-nowrap transition"
            >
              🚦 In traffic
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setInputMsg('Please leave it at the gate.')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-[11px] whitespace-nowrap transition"
            >
              🚪 Leave at gate
            </button>
            <button
              onClick={() => setInputMsg('I am coming down now.')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-[11px] whitespace-nowrap transition"
            >
              🏃 Coming down
            </button>
          </>
        )}
      </div>

      {/* INPUT FORM */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-zinc-200 flex gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Type message..."
          className="flex-1 bg-zinc-100 rounded-xl px-3.5 py-2 text-xs text-zinc-900 outline-none focus:ring-1 focus:ring-emerald-600 transition"
        />
        <button
          type="submit"
          className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}