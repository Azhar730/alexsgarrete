"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Paperclip, Send, MoreVertical, User, MessageSquare, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  useGetConversationsQuery, 
  useGetMessagesQuery, 
  useSendMessageMutation,
  useMarkAsReadMutation,
  useGetSupportAdminQuery,
  useCreateConversationMutation
} from "@/redux/api/chatApi";
import { useSocket } from "@/hooks/useSocket";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMeQuery } from "@/redux/api/userApi";
import { setUser } from "@/redux/features/authSlice";

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  
  const auth = useSelector((state: any) => state.auth);
  const user = auth?.user;

  const { data: meRes } = useGetMeQuery(undefined, {
    skip: !!user
  });

  useEffect(() => {
    if (meRes?.success && meRes.data && !user) {
      dispatch(setUser({ user: meRes.data, token: "" })); // Token might be in cookie
    }
  }, [meRes, user, dispatch]);

  const { data: supportAdmin } = useGetSupportAdminQuery(undefined);
  const { data: convsRes, refetch: refetchConvs } = useGetConversationsQuery(undefined, {
    skip: !user && !meRes?.data
  });
  
  const conversations = convsRes || [];
  const { data: messagesRes, refetch: refetchMessages } = useGetMessagesQuery(activeChat, {
    skip: !activeChat
  });

  const messages = messagesRes || [];
  const [sendMessage] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [createConversation] = useCreateConversationMutation();

  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeConversation = (conversations as any[]).find(c => c.id === activeChat);

  useEffect(() => {
    if (conversations.length > 0 && !activeChat) {
      setActiveChat(conversations[0].id);
    }
  }, [conversations, activeChat]);

  useEffect(() => {
    if (activeChat) {
      markAsRead(activeChat);
    }
  }, [activeChat, markAsRead]);

  useEffect(() => {
    if (messages.length === 0) return;
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, otherUserTyping]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (message: any) => {
      if (message.conversationId === activeChat) {
        refetchMessages?.();
        markAsRead(activeChat);
      } else {
        if (user) refetchConvs?.();
      }
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
  }, [socket, activeChat, refetchMessages, refetchConvs, markAsRead]);

  // Join room on active chat change
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

  const handleStartWithSupport = async () => {
    if (supportAdmin) {
      try {
        const res: any = await createConversation([supportAdmin.id]).unwrap();
        setActiveChat(res.id);
        refetchConvs();
      } catch (err) {
        console.error("Failed to start support chat", err);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      {/* Sidebar: Conversations List */}
      <div className="w-80 shrink-0 border-r border-slate-50 flex flex-col bg-slate-50/20">
        <div className="p-4 border-b border-slate-50">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8 h-10 text-sm bg-white border-slate-100 placeholder:text-muted-foreground focus-visible:ring-slate-200"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length > 0 ? (
            conversations.map((conv: any) => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv.id)}
                className={cn(
                  "w-full text-left flex items-center gap-3 p-4 border-b border-slate-50 transition-all hover:bg-white",
                  activeChat === conv.id ? "bg-white shadow-sm ring-1 ring-slate-100 z-10" : "opacity-70 grayscale-[0.5]"
                )}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {conv.otherParticipant?.avatarUrl ? (
                      <img src={conv.otherParticipant.avatarUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  {conv.otherParticipant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={cn("text-sm truncate", activeChat === conv.id ? "font-bold text-slate-900" : "font-semibold text-slate-600")}>
                      {conv.otherParticipant?.fullName || "Support Agent"}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                      {conv.lastMessage ? format(new Date(conv.lastMessage.createdAt), "HH:mm") : ""}
                    </span>
                  </div>
                  <p className={cn("text-xs truncate", conv.unreadCount > 0 ? "font-bold text-slate-900" : "text-slate-500")}>
                    {conv.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-40">
              <MessageSquare className="w-10 h-10 mb-3" />
              <p className="text-xs font-bold">No conversations</p>
              <Button onClick={handleStartWithSupport} variant="outline" size="sm" className="mt-4 text-[10px] font-bold uppercase tracking-widest h-8">
                Chat with Support
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main: Chat Thread */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="h-16 border-b border-slate-50 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {activeConversation?.otherParticipant?.avatarUrl ? (
                      <img src={activeConversation.otherParticipant.avatarUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  {activeConversation?.otherParticipant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{activeConversation?.otherParticipant?.fullName || "Support Agent"}</p>
                  <p className={cn("text-[10px] font-bold uppercase tracking-widest", activeConversation?.otherParticipant?.isOnline ? "text-emerald-500" : "text-slate-400")}>
                    {activeConversation?.otherParticipant?.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-slate-400 hover:text-secondary hover:bg-slate-50 rounded-xl transition-all">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/10 custom-scrollbar min-h-0">
              {messages.map((msg: any) => {
                const isMine = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={cn("flex gap-3", isMine ? "flex-row-reverse" : "flex-row")}
                  >
                    <div className={cn("max-w-md", isMine ? "items-end flex flex-col" : "flex flex-col")}>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                          isMine
                            ? "bg-primary text-white rounded-tr-sm"
                            : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
                        )}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1.5 font-medium px-1">
                        {format(new Date(msg.createdAt), "HH:mm")}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {otherUserTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-2 rounded-xl border border-slate-50 flex items-center gap-2 shadow-sm">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4 w-full shrink-0" />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-50 flex items-center gap-2 bg-white">
              <Button variant="ghost" type="button" size="icon" className="h-10 w-10 text-slate-400 shrink-0 hover:bg-slate-50 rounded-xl">
                <Paperclip size={18} />
              </Button>
              <Input
                value={messageText}
                onChange={handleTyping}
                placeholder="Type your message..."
                className="flex-1 h-11 text-sm bg-slate-50/50 border-slate-100 placeholder:text-muted-foreground focus-visible:ring-primary/20 rounded-xl"
              />
              <Button
                type="submit"
                disabled={!messageText.trim()}
                size="icon"
                className="h-11 w-11 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 shrink-0 rounded-xl"
              >
                <Send size={18} className="text-white" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
            <MessageSquare className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-bold">Select a message</h3>
            <p className="text-sm max-w-xs mx-auto">Choose a conversation from the list to view the full message history.</p>
          </div>
        )}
      </div>
    </div>
  );
}
