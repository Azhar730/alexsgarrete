"use client";

import { useState } from "react";
import { Search, Paperclip, Send, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const threads = [
  {
    id: "1",
    sender: "Encore Team",
    preview: "We're reviewing your application.",
    date: "Yesterday",
  },
  {
    id: "2",
    sender: "Encore Team",
    preview: "We're reviewing your application.",
    date: "Yesterday",
  },
  {
    id: "3",
    sender: "Encore Team",
    preview: "Please sign your agreement to start.",
    date: "Oct 1",
  },
];

const messages = [
  {
    id: "1",
    from: "admin",
    text: "Hi Sarah! Good news, we've reviewed your application and Buster's custom quote is ready for your review.",
    time: "10:41 AM",
  },
  {
    id: "2",
    from: "admin",
    text: "You can view the details and accept the plan below to get Buster fully covered.",
    time: "10:42 AM",
    planCard: { name: "Premium Monthly Plan", price: 45 },
  },
  {
    id: "3",
    from: "user",
    text: "Thanks, that's great!",
    time: "10:41 AM",
  },
];

function PlanQuoteCard({ name, price }: { name: string; price: number }) {
  return (
    <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 w-52">
      <p className="text-sm font-semibold text-secondary mb-1">{name}</p>
      <p className="text-2xl font-bold text-secondary">
        ${price.toFixed(2)}
        <span className="text-base font-normal text-muted-foreground"> / mo</span>
      </p>
      <Button size="sm" className="mt-3 w-full bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground text-sm">
        Review
      </Button>
    </div>
  );
}

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState("1");
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Thread list */}
      <div className="w-64 shrink-0 border-r border-slate-100 flex flex-col">
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-8 h-9 text-sm text-secondary bg-slate-50 border-slate-200 placeholder:text-muted-foreground focus-visible:ring-slate-300"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setSelectedThread(thread.id)}
              className={cn(
                "w-full text-left flex items-start gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors",
                selectedThread === thread.id && "bg-slate-50"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-muted-foreground">ET</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-semibold text-secondary truncate">
                    {thread.sender}
                  </p>
                  <span className="text-xs text-muted-foreground shrink-0 ml-1">
                    {thread.date}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{thread.preview}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 border-b border-slate-100 flex items-center justify-between px-5">
          <div>
            <p className="text-base font-bold text-secondary">Encore Admin</p>
            <p className="text-sm text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
              Support Team Online
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreVertical size={16} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex gap-3", msg.from === "user" && "flex-row-reverse")}
            >
              {msg.from === "admin" && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-xs font-bold text-slate-500">EA</span>
                </div>
              )}
              <div className={cn("max-w-xs", msg.from === "user" && "items-end flex flex-col")}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-base",
                    msg.from === "admin"
                      ? "bg-slate-100 text-secondary rounded-tl-sm"
                      : "bg-primary text-white rounded-tr-sm"
                  )}
                >
                  {msg.text}
                  {msg.planCard && (
                    <PlanQuoteCard name={msg.planCard.name} price={msg.planCard.price} />
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1 px-1">{msg.time}</span>
              </div>
              {msg.from === "user" && (
                <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-xs font-bold text-amber-800">SJ</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground shrink-0">
            <Paperclip size={16} />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message or ask a question..."
            className="flex-1 h-10 text-base text-secondary bg-slate-50 border-slate-200 placeholder:text-muted-foreground focus-visible:ring-slate-300"
          />
          <Button
            size="icon"
            className="h-9 w-9 bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground shrink-0"
          >
            <Send size={14} className="text-primary-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
