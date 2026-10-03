'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  ShieldCheck,
  User,
  CheckCheck,
  Clock,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useCall } from '../../../../../communication/call/useCall';
import ShipmentService from '@/src/app/rider/dashboard/jobs/[shipmentId]/services/shipment.service';
import { useChatRoom } from '@/src/components/useChatRoom';

const RIDER_QUICK_PRESETS = [
  "I have arrived at the pickup location.",
  "I am currently on my way to your delivery address.",
  "I'm outside your building, please come down.",
  "Traffic is a bit heavy, running 5 minutes late.",
  "Package delivered successfully. Thank you!"
];

export default function RiderChatPage() {
  const params = useParams();
  const routeParamId = (params?.shipmentId as string) || '';

  const {
    socketRef,
    currentUserId,
    isConnected,
    messages,
    inputMessage,
    setInputMessage,
    otherUserId: customerUserId,
    otherUserName: customerName,
    isLoading: isChatLoading,
    error: chatError,
    chatBottomRef,
    handleSendMessage,
    formatTimer,
  } = useChatRoom({
    jobId: routeParamId,
    fetchShipment: async () => {
      if (!routeParamId) throw new Error('Missing shipment ID reference.');
     const response: any = await ShipmentService.getJob(routeParamId);
      const shipmentData = response?.shipment || response || {};
      
      return {
        otherUserId: 
          shipmentData?.recipient?.userId || 
          shipmentData?.recipient?._id || 
          shipmentData?.customerId || 
          shipmentData?.userId || 
          '',
        otherUserName: 
          shipmentData?.recipient?.name || 
          shipmentData?.customerName || 
          shipmentData?.customer?.name || 
          'Customer',
      };
    },
  });

  const callHandlers = useCall({
    socket: socketRef.current,
    jobId: routeParamId,
    currentUserId,
  });

  useEffect(() => {
    console.log('[RiderChat DEBUG] Current Connection Status:', { isConnected, currentUserId, routeParamId });
  }, [isConnected, currentUserId, routeParamId]);

  useEffect(() => {
    messages.forEach((msg, idx) => {
      const isMe =
        msg.senderId === currentUserId ||
        msg.senderRole === 'RIDER' ||
        (msg as any).senderType === 'RIDER' ||
        (msg as any).role === 'RIDER';
      console.log(`[RiderChat DEBUG] Message [${idx}]:`, { text: msg.text, senderId: msg.senderId, currentUserId, senderRole: msg.senderRole, isMe });
    });
  }, [messages, currentUserId]);

  if (isChatLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] bg-slate-50 text-slate-600">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
        <p className="text-xs font-semibold">Connecting rider secure channel...</p>
      </div>
    );
  }

  if (chatError) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] bg-slate-50 p-6 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
        <h3 className="text-sm font-bold text-slate-800">Connection Error</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">{chatError}</p>
        <Link href={`/rider/dashboard`} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      <audio ref={callHandlers.remoteAudioRef} autoPlay playsInline />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3">
          <Link href={`/rider/dashboard/jobs/${routeParamId}`} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{customerName || 'Customer'}</h2>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>Delivery #{routeParamId.slice(0, 8)}</span>
                <span>•</span>
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                <span>Secure Link</span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => callHandlers.callUser(customerUserId, customerName)}
          disabled={!isConnected || callHandlers.isCalling || callHandlers.isCallConnected || !customerUserId}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition shadow-xs cursor-pointer"
        >
          <Phone className="w-4 h-4" /> Call Customer
        </button>
      </header>

      {/* Active Call Banner */}
      {(callHandlers.isCalling || callHandlers.isReceivingCall || callHandlers.isCallConnected) && (
        <div className="bg-emerald-900 text-white p-3 shadow-md flex items-center justify-between border-b border-emerald-800 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <p className="text-xs font-semibold">
                {callHandlers.isCalling && `Calling ${customerName}...`}
                {callHandlers.isReceivingCall && `Incoming audio call from ${callHandlers.callerName}`}
                {callHandlers.isCallConnected && `Active Voice Call (${formatTimer(callHandlers.callDuration)})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {callHandlers.isReceivingCall ? (
              <>
                <button onClick={callHandlers.answerCall} className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer">
                  <Phone className="w-3.5 h-3.5" /> Answer
                </button>
                <button onClick={callHandlers.endCall} className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer">
                  <PhoneOff className="w-3.5 h-3.5" /> Decline
                </button>
              </>
            ) : (
              <>
                {callHandlers.isCallConnected && (
                  <button onClick={callHandlers.toggleMute} className={`p-2 rounded-lg text-xs font-semibold cursor-pointer ${callHandlers.isMuted ? 'bg-amber-500' : 'bg-emerald-800'}`}>
                    {callHandlers.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                <button onClick={callHandlers.endCall} className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer">
                  <PhoneOff className="w-3.5 h-3.5" /> End Call
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
            <Sparkles className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="text-sm font-semibold text-slate-700">Rider Dispatch Portal</p>
            <p className="text-xs max-w-xs text-slate-500">Keep the customer updated on your transit progress.</p>
            <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800 text-left max-w-sm">
              <span className="font-bold">Debug Info:</span> Connected: {String(isConnected)} | Messages Count: {messages.length} | UserID: {currentUserId || 'None'}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe =
              msg.senderId === currentUserId ||
              msg.senderRole === 'RIDER' ||
              (msg as any).senderType === 'RIDER' ||
              (msg as any).role === 'RIDER';

            return (
              <div key={msg.id || `${msg.timestamp}-${index}`} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`p-3.5 rounded-2xl text-xs max-w-[75%] shadow-xs ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                    <Clock className="w-2.5 h-2.5" />
                    <span>{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-200 ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </main>

      {/* Sticky Bottom Section */}
      <div className="shrink-0 bg-white border-t border-slate-200 z-10 shadow-md">
        {/* Quick Presets Bar */}
        <div className="px-3 py-2 bg-slate-100/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {RIDER_QUICK_PRESETS.map((preset, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(preset)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:text-emerald-700 shrink-0 shadow-xs transition cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Input Form Footer */}
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            handleSendMessage(); 
          }} 
          className="p-3 flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message to the customer..."
            disabled={!isConnected}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs p-3 rounded-2xl outline-none focus:border-emerald-500 shadow-inner"
          />
          <button 
            type="submit" 
            disabled={!inputMessage.trim() || !isConnected} 
            className="p-3 bg-emerald-600 disabled:bg-slate-200 text-white rounded-2xl shadow-xs transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}