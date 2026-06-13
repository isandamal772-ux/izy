import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, X, ChevronDown, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      parts: [{ text: "Ayubowan! 🌸 I am your **IZYSL.COM AI Assistant**. I can help you plan your itinerary, explain local transport, convert currency, look up hiking paths, suggest restaurants, or review Sri Lankan historical facts. What's on your travel mind?" }]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Plan a 3-day itinerary of Galle & Mirissa",
    "What is the best month to visit Ella? ⛰️",
    "How do I get a tourist visa for Sri Lanka?",
    "Suggest the best spicy local dishes to try 🍛"
  ];

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    if (!customText) {
      setInputMessage("");
    }
    setErrorText(null);

    const userMsg: Message = {
      role: "user",
      parts: [{ text: textToSend }]
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Map history to server's expected shape
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred fetching response.");
      }

      const modelMsg: Message = {
        role: "model",
        parts: [{ text: data.text || "I was unable to process your request." }]
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Failed to communicate with the assistant. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "model",
        parts: [{ text: "Chat refreshed! Ask me anything about Ella Rock, Polhena sea turtles, or visa guidelines." }]
      }
    ]);
    setErrorText(null);
  };

  return (
    <>
      {/* Floating CTA Button with animated pulse */}
      <motion.button
        id="btn-ai-trigger"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-600 text-white font-medium px-4 py-3.5 rounded-full shadow-2xl hover:brightness-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <Sparkles className="w-5 h-5 animate-pulse text-yellow-200" />
        <span className="text-sm font-sans tracking-wide">AI Travel Guide</span>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
      </motion.button>

      {/* Floating Drawer / Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-wrapper"
            className="fixed bottom-6 right-6 z-50 w-full max-w-[420px] h-[580px] bg-white/95 dark:bg-slate-900/98 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-3xl overflow-hidden flex flex-col pointer-events-auto"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-sky-700 text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-yellow-200" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-sm tracking-wide">AI Travel Assistant</h3>
                  <p className="text-[11px] text-emerald-150 font-mono opacity-80">Powered by Gemini 3.5 Flash</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-ai-refresh"
                  onClick={clearChat}
                  title="Clear Chat History"
                  className="p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  id="btn-ai-close"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        isUser
                          ? "bg-emerald-600 text-white rounded-br-none font-medium"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                      } shadow-sm`}
                    >
                      {/* Simple Markdown Parsing helper */}
                      <p className="whitespace-pre-wrap">
                        {msg.parts[0].text.split("**").map((chunk, i) => {
                          if (i % 2 === 1) {
                            return <strong key={i} className="font-bold underline text-yellow-500 dark:text-emerald-400">{chunk}</strong>;
                          }
                          return chunk;
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl rounded-bl-none p-3.5 text-xs shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    <span>AI Guide is drafting recommendations...</span>
                  </div>
                </div>
              )}

              {errorText && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900 flex flex-col gap-1.5">
                  <span className="font-semibold">Service Notice:</span>
                  <p>{errorText}</p>
                  <p className="text-[10px] opacity-80 leading-none">Operating with offline-safeguard features in sandbox mode.</p>
                </div>
              )}

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="pt-4 space-y-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-medium text-slate-400 font-sans tracking-wide">Suggested questions:</p>
                  <div className="flex flex-col gap-1.5">
                    {suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        id={`btn-suggest-${i}`}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-500/50 transition-all cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              id="ai-assistant-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-150 dark:border-slate-800 flex gap-2"
            >
              <input
                id="ai-chat-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask helper (e.g. visa, safari costs)..."
                disabled={isLoading}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-800 dark:text-slate-100 transition-colors"
              />
              <button
                id="btn-ai-chat-submit"
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-emerald-600 text-white rounded-xl p-2.5 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
