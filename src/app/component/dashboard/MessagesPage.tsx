"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Paperclip, Send, MoreVertical, User, MessageSquare, Info, ArrowLeft, Loader2, X, FileText, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  useGetConversationsQuery, 
  useGetMessagesQuery, 
  useSendMessageMutation,
  useMarkAsReadMutation,
  useGetSupportAdminQuery,
  useCreateConversationMutation,
  useUploadFilesMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingAttachments, setEditingAttachments] = useState<string[]>([]);
  const [editingNewFiles, setEditingNewFiles] = useState<File[]>([]);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
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
  const { data: convsRes, isLoading: isLoadingConvs, refetch: refetchConvs } = useGetConversationsQuery(undefined, {
    skip: !user && !meRes?.data
  });
  
  const conversations = convsRes || [];
  const { data: messagesRes, isLoading: isLoadingMessages, refetch: refetchMessages } = useGetMessagesQuery(activeChat, {
    skip: !activeChat
  });

  const messages = messagesRes || [];
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();
  const [updateMessage, { isLoading: isUpdating }] = useUpdateMessageMutation();
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [createConversation] = useCreateConversationMutation();

  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeConversation = (conversations as any[]).find(c => c.id === activeChat);

  useEffect(() => {
    if (!isMobile && conversations.length > 0 && !activeChat) {
      setActiveChat(conversations[0].id);
    }
  }, [conversations, activeChat, isMobile]);

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

    socket.on("message_updated", (message: any) => {
      if (message.conversationId === activeChat) {
        refetchMessages?.();
      }
    });

    socket.on("message_deleted", (message: any) => {
      if (message.conversationId === activeChat) {
        refetchMessages?.();
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
      socket.off("message_updated");
      socket.off("message_deleted");
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
    if ((!messageText.trim() && selectedFiles.length === 0) || !activeChat) return;

    try {
      let attachmentUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
        const uploadRes = await uploadFiles(formData).unwrap();
        attachmentUrls = uploadRes.data?.urls || uploadRes.urls || [];
      }

      await sendMessage({
        conversationId: activeChat,
        content: messageText.trim() || " ", // if empty text but has attachments
        attachments: attachmentUrls
      }).unwrap();
      setMessageText("");
      setSelectedFiles([]);
      refetchMessages();
      refetchConvs();
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  const handleSaveEdit = async (messageId: string) => {
    if (!editingContent.trim() && editingAttachments.length === 0 && editingNewFiles.length === 0) return;
    try {
      let uploadedUrls: string[] = [];
      if (editingNewFiles.length > 0) {
        const formData = new FormData();
        editingNewFiles.forEach((file) => formData.append("files", file));
        const uploadRes = await uploadFiles(formData).unwrap();
        uploadedUrls = uploadRes.data?.urls || uploadRes.urls || [];
      }
      
      const finalAttachments = [...editingAttachments, ...uploadedUrls];

      await updateMessage({ messageId, content: editingContent.trim() || " ", attachments: finalAttachments }).unwrap();
      setEditingMessageId(null);
      setEditingContent("");
      setEditingAttachments([]);
      setEditingNewFiles([]);
      refetchMessages();
    } catch (err) {
      console.error("Failed to edit", err);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      setDeletingMessageId(messageId);
      try {
        await deleteMessage(messageId).unwrap();
        refetchMessages();
      } catch (err) {
        console.error("Failed to delete", err);
      } finally {
        setDeletingMessageId(null);
      }
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
      <div className={cn(
        "w-full md:w-80 shrink-0 border-r border-slate-50 flex flex-col bg-slate-50/20",
        activeChat ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-slate-50">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8 h-10 text-sm bg-white border-slate-100 placeholder:text-muted-foreground focus-visible:ring-slate-200"
            />
          </div>
        </div>
        <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoadingConvs ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded w-2/3" />
                    <div className="h-2.5 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length > 0 ? (
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
      <div className={cn(
        "flex-1 flex flex-col min-w-0 bg-white",
        activeChat ? "flex" : "hidden md:flex"
      )}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="h-16 border-b border-slate-50 flex items-center justify-between px-4 sm:px-6 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
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
            {isLoadingMessages ? (
              <div data-lenis-prevent className="flex-1 p-6 space-y-4 bg-slate-50/10 overflow-y-auto">
                {[1, 2, 3, 4].map((i) => {
                  const isMine = i % 2 === 0;
                  return (
                    <div
                      key={i}
                      className={cn("flex gap-3 animate-pulse", isMine ? "flex-row-reverse" : "flex-row")}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                      <div className={cn("flex flex-col space-y-1.5", isMine ? "items-end" : "items-start")}>
                        <div
                          className={cn(
                            "h-9 bg-slate-200 rounded-2xl w-48 sm:w-64",
                            isMine ? "rounded-tr-sm" : "rounded-tl-sm"
                          )}
                        />
                        <div className="h-2 bg-slate-200 rounded w-12" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/10 custom-scrollbar min-h-0">
                {messages.map((msg: any) => {
                  const isMine = msg.senderId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex gap-3 group", isMine ? "flex-row-reverse" : "flex-row")}
                    >
                      <div className={cn("max-w-md", isMine ? "items-end flex flex-col" : "flex flex-col")}>
                        {msg.isDeleted ? (
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm italic text-slate-400",
                              isMine
                                ? "bg-slate-100 rounded-tr-sm"
                                : "bg-white border border-slate-100 rounded-tl-sm"
                            )}
                          >
                            This message was deleted
                          </div>
                        ) : editingMessageId === msg.id ? (
                          <div className="flex flex-col gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm w-full min-w-[250px]">
                            {(editingAttachments.length > 0 || editingNewFiles.length > 0) && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {editingAttachments.map((url: string, idx: number) => {
                                  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
                                  return (
                                    <div key={`old-${idx}`} className="relative block max-w-[150px] rounded-lg border border-slate-200 pr-6">
                                      {isImage ? (
                                        <img src={url} alt="attachment" className="h-12 w-auto object-cover rounded-md" />
                                      ) : (
                                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-xs font-semibold">
                                          <FileText className="w-4 h-4" />
                                          <span>File {idx + 1}</span>
                                        </div>
                                      )}
                                      <button type="button" onClick={() => setEditingAttachments(prev => prev.filter((_, i) => i !== idx))} className="absolute right-1 top-1 bg-white/80 rounded-full p-0.5 hover:bg-slate-200 transition-colors">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  );
                                })}
                                {editingNewFiles.map((file, idx) => (
                                    <div key={`new-${idx}`} className="relative flex items-center gap-2 bg-slate-100 p-2 rounded-lg pr-6">
                                      <FileText className="w-4 h-4 text-slate-500" />
                                      <span className="text-xs font-semibold max-w-[100px] truncate">{file.name}</span>
                                      <button type="button" onClick={() => setEditingNewFiles(prev => prev.filter((_, i) => i !== idx))} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                ))}
                              </div>
                            )}
                            <Input 
                              value={editingContent} 
                              onChange={(e) => setEditingContent(e.target.value)} 
                              className="text-sm bg-slate-50 border-slate-100"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit(msg.id);
                                if (e.key === "Escape") setEditingMessageId(null);
                              }}
                            />
                            <div className="flex justify-between items-center gap-2 mt-1">
                              <div>
                                <input type="file" multiple ref={editFileInputRef} className="hidden" onChange={(e) => {
                                  if (e.target.files) {
                                    setEditingNewFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                                  }
                                }} />
                                <Button size="sm" variant="ghost" onClick={() => editFileInputRef.current?.click()} className="h-7 text-xs text-slate-500 px-2">
                                  <Paperclip className="w-3.5 h-3.5 mr-1" /> Add Files
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => setEditingMessageId(null)} className="h-7 text-xs">Cancel</Button>
                                <Button size="sm" onClick={() => handleSaveEdit(msg.id)} disabled={isUploading || isUpdating} className="h-7 text-xs">
                                  {(isUploading || isUpdating) && editingMessageId === msg.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                  Save
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                              isMine
                                ? "bg-primary text-white rounded-tr-sm"
                                : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
                            )}
                          >
                            {msg.content !== " " && msg.content}
                            
                            {/* Attachments rendering */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {msg.attachments.map((url: string, idx: number) => {
                                  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
                                  if (isImage) {
                                    return (
                                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block max-w-[200px] overflow-hidden rounded-lg">
                                        <img src={url} alt="attachment" className="w-full h-auto object-cover" />
                                      </a>
                                    );
                                  }
                                  return (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-black/5 rounded-lg text-xs font-semibold hover:bg-black/10 transition-colors">
                                      <FileText className="w-4 h-4" />
                                      <span>Attachment {idx + 1}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                        <span className="text-[10px] text-muted-foreground mt-1.5 font-medium px-1 flex gap-1">
                          {format(new Date(msg.createdAt), "HH:mm")}
                          {msg.isEdited && !msg.isDeleted && <span className="italic opacity-70">(edited)</span>}
                        </span>
                      </div>
                      
                      {isMine && !msg.isDeleted && editingMessageId !== msg.id && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity self-center">
                          <button onClick={() => { 
                            setEditingMessageId(msg.id); 
                            setEditingContent(msg.content === " " ? "" : msg.content); 
                            setEditingAttachments(msg.attachments || []);
                            setEditingNewFiles([]);
                          }} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 bg-white shadow-sm border border-slate-100 transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(msg.id)} disabled={isDeleting && deletingMessageId === msg.id} className="p-1.5 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-500 bg-white shadow-sm border border-slate-100 transition-colors" title="Delete">
                            {isDeleting && deletingMessageId === msg.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
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
            )}

            {/* Input Area */}
            <div className="flex flex-col bg-white border-t border-slate-50 shrink-0">
              {/* Preview Area */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 pb-0 border-b border-slate-50">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative flex items-center gap-2 bg-slate-100 p-2 rounded-lg pr-8">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-semibold max-w-[150px] truncate">{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleSend} className="p-4 flex items-center gap-2">
                <input 
                  type="file" 
                  multiple 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files) {
                      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                    }
                  }}
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="ghost" 
                  type="button" 
                  size="icon" 
                  className="h-10 w-10 text-slate-400 shrink-0 hover:bg-slate-50 rounded-xl"
                >
                  <Paperclip size={18} />
                </Button>
                <Input
                  value={messageText}
                  onChange={handleTyping}
                  disabled={isSending || isUploading}
                  placeholder={isSending || isUploading ? "Sending..." : "Type your message..."}
                  className="flex-1 h-11 text-sm bg-slate-50/50 border-slate-100 placeholder:text-muted-foreground focus-visible:ring-primary/20 rounded-xl"
                />
                <Button
                  type="submit"
                  disabled={(!messageText.trim() && selectedFiles.length === 0) || isSending || isUploading}
                  size="icon"
                  className="h-11 w-11 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 shrink-0 rounded-xl flex items-center justify-center"
                >
                  {isSending || isUploading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send size={18} className="text-white" />
                  )}
                </Button>
              </form>
            </div>
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
