import { useState, useRef, useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
};

interface UseCallProps {
  socket: Socket | null;
  jobId: string;
  currentUserId: string;
}

export function useCall({ socket, jobId, currentUserId }: UseCallProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callerName, setCallerName] = useState('Rider');
  const [targetUserId, setTargetUserId] = useState<string | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);
  const incomingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);

  const startTimer = useCallback(() => {
    setCallDuration(0);
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const cleanupCall = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    iceCandidatesQueue.current = [];
    incomingOfferRef.current = null;
    setTargetUserId(null);
    setIsCalling(false);
    setIsReceivingCall(false);
    setIsCallConnected(false);
    setIsMuted(false);
    setCallDuration(0);
  }, []);

  const createPeerConnection = useCallback((remoteId: string) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice_candidate', {
          targetUserId: remoteId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current && event.streams[0]) {
        remoteAudioRef.current.srcObject = event.streams[0];
        remoteAudioRef.current.play().catch((err) => console.error('Audio play error:', err));
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (['disconnected', 'failed', 'closed'].includes(pc.iceConnectionState)) {
        cleanupCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [socket, cleanupCall]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data: {
      jobId: string;
      offer: RTCSessionDescriptionInit;
      callerUserId: string;
      callerName: string;
    }) => {
      setTargetUserId(data.callerUserId);
      incomingOfferRef.current = data.offer;
      setCallerName(data.callerName || 'Rider');
      setIsReceivingCall(true);
    };

    const handleCallAccepted = async (data: { answer: RTCSessionDescriptionInit; responderUserId: string }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          while (iceCandidatesQueue.current.length > 0) {
            const cand = iceCandidatesQueue.current.shift();
            if (cand) await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(cand));
          }
          setIsCalling(false);
          setIsCallConnected(true);
          startTimer();
        } catch (err) {
          console.error('Error setting remote description:', err);
          cleanupCall();
        }
      }
    };

    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit; senderUserId: string }) => {
      try {
        if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else {
          iceCandidatesQueue.current.push(data.candidate);
        }
      } catch (e) {
        console.error('Error adding ICE candidate:', e);
      }
    };

    const handleCallEnded = () => cleanupCall();

    socket.on('incoming_call', handleIncomingCall);
    socket.on('call_accepted', handleCallAccepted);
    socket.on('ice_candidate', handleIceCandidate);
    socket.on('call_ended', handleCallEnded);

    return () => {
      socket.off('incoming_call', handleIncomingCall);
      socket.off('call_accepted', handleCallAccepted);
      socket.off('ice_candidate', handleIceCandidate);
      socket.off('call_ended', handleCallEnded);
    };
  }, [socket, cleanupCall, startTimer]);

  const callUser = async (recipientUserId: string, name: string) => {
    if (!socket) return;
    try {
      setTargetUserId(recipientUserId);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      const pc = createPeerConnection(recipientUserId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      setIsCalling(true);
      socket.emit('call_user', {
        jobId,
        recipientUserId,
        offer,
        callerName: name,
      });
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Microphone access is required to call.');
      cleanupCall();
    }
  };

  const answerCall = async () => {
    if (!socket || !incomingOfferRef.current || !targetUserId) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      const pc = createPeerConnection(targetUserId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(incomingOfferRef.current));
      while (iceCandidatesQueue.current.length > 0) {
        const cand = iceCandidatesQueue.current.shift();
        if (cand) await pc.addIceCandidate(new RTCIceCandidate(cand));
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('answer_call', {
        targetUserId,
        answer,
      });

      setIsReceivingCall(false);
      setIsCallConnected(true);
      startTimer();
    } catch (err) {
      console.error('Error answering call:', err);
      cleanupCall();
    }
  };

  const endCall = () => {
    if (socket && targetUserId) {
      socket.emit('end_call', { targetUserId, jobId });
    }
    cleanupCall();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
      }
    }
  };

  return {
    isCalling,
    isReceivingCall,
    isCallConnected,
    isMuted,
    callDuration,
    callerName,
    remoteAudioRef,
    callUser,
    answerCall,
    endCall,
    toggleMute,
  };
}