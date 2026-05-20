"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, X, Send, User, 
  Minus, Maximize2, MoreHorizontal, Paperclip, Smile
} from "lucide-react";
import { 
  useGetConversationsQuery, 
  useGetMessagesQuery, 
  useSendMessageMutation,
  useCreateConversationMutation,
  useMarkAsReadMutation,
  useGetSupportAdminQuery
} from "@/redux/api/chatApi";
import { useSocket } from "@/hooks/useSocket";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  
  const auth = useSelector((state: any) => state.auth);
  const user = auth?.user;

  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: supportAdmin } = useGetSupportAdminQuery(undefined, {
    skip: !isOpen
  });
  const { data: convsRes, refetch: refetchConvs } = useGetConversationsQuery(undefined, {
    skip: !user
  });
  const [createConversation] = useCreateConversationMutation();
  const [sendMessage] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();

  const conversations = convsRes || [];
  const { data: messagesRes, refetch: refetchMessages } = useGetMessagesQuery(activeChat, {
    skip: !activeChat
  });

  const messages = messagesRes || [];

  useEffect(() => {
    if (isOpen && supportAdmin && !activeChat) {
      const existingConv = (conversations as any[]).find(c => 
        c.otherParticipant?.id === supportAdmin.id
      );
      if (existingConv) {
        setActiveChat(existingConv.id);
      } else {
        createConversation([supportAdmin.id]).then((res: any) => {
          if (res.data) setActiveChat(res.data.id);
        });
      }
    }
  }, [isOpen, supportAdmin, conversations, activeChat, createConversation]);

  useEffect(() => {
    if (messages.length === 0) return;
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, otherUserTyping, isOpen]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (message: any) => {
      if (message.conversationId === activeChat) {
        refetchMessages();
        markAsRead(activeChat);
      }
      refetchConvs();
    });

    socket.on("display_typing", (data: { senderId: string; conversationId: string; isTyping: boolean }) => {
      if (data.conversationId === activeChat) {
        setOtherUserTyping(data.isTyping ? data.senderId : null);
      }
    });

    socket.on("user_status", (data: { userId: string; status: string }) => {
      if (user) refetchConvs?.();
    });

    return () => {
      socket.off("new_message");
      socket.off("display_typing");
      socket.off("user_status");
    };
  }, [socket, activeChat, refetchMessages, refetchConvs, markAsRead, dispatch]);

  useEffect(() => {
    if (!socket || !activeChat) return;
    
    socket.emit("conversation:join", { conversationId: activeChat });
    
    return () => {
      socket.emit("conversation:leave", { conversationId: activeChat });
    };
  }, [socket, activeChat]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    if (!socket || !activeChat) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { conversationId: activeChat, isTyping: true });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", { conversationId: activeChat, isTyping: false });
    }, 2000);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageText.trim() || !activeChat) return;

    try {
      await sendMessage({
        conversationId: activeChat,
        content: messageText.trim()
      }).unwrap();
      setMessageText("");
      refetchMessages();
      refetchConvs();
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  if (!user) return null;

  if (pathname === "/dashboard/messages") return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                    {supportAdmin?.avatarUrl ? (
                      <img src={supportAdmin.avatarUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-gray-900 rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">{supportAdmin?.fullName || "Support Agent"}</h4>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Always Online</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all ml-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 custom-scrollbar min-h-0">
              {messages.map((msg: any) => {
                const isMine = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isMine 
                        ? 'bg-gray-900 text-white rounded-br-none' 
                        : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                    }`}>
                      {msg.content}
                      <div className={`text-[9px] mt-1 font-bold ${isMine ? 'text-gray-400' : 'text-gray-300'} text-right`}>
                        {format(new Date(msg.createdAt), "HH:mm")}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {otherUserTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-3 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-1 h-1 bg-gray-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1 h-1 bg-gray-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1 h-1 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4 w-full shrink-0" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={handleTyping}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none outline-none px-3 text-sm font-medium text-gray-900"
                />
                <button 
                  type="submit"
                  disabled={!messageText.trim()}
                  className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {conversations.some((c: any) => c.unreadCount > 0) && !isOpen && (
          <div className="absolute top-0 right-0 w-5 h-5 bg-[#85A1D1] text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
            !
          </div>
        )}
      </motion.button>
    </div>
  );
}
