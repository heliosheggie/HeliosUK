import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Sparkles, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';
import type { Message } from '../types';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  getDocs,
  limit
} from 'firebase/firestore';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! I'm Helios, your home energy advisor. How can I help you save energy and money today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(localStorage.getItem('helios_chat_id'));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Sync with Firestore
  useEffect(() => {
    if (!chatId) return;

    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const dbMessages = snapshot.docs.map(doc => ({
        role: doc.data().role as 'user' | 'model',
        content: doc.data().content
      }));
      
      if (dbMessages.length > 0) {
        setMessages(dbMessages);
      }
    }, (error) => {
      console.error("Firestore Chat Error:", error);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let currentChatId = chatId;
    if (!currentChatId) {
      // Create new chat session
      try {
        const chatRef = await addDoc(collection(db, 'chats'), {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        currentChatId = chatRef.id;
        setChatId(currentChatId);
        localStorage.setItem('helios_chat_id', currentChatId);
      } catch (err) {
        console.error("Error creating chat session:", err);
        return;
      }
    }

    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // 1. Save user message to Firestore
      const messagesRef = collection(db, 'chats', currentChatId, 'messages');
      await addDoc(messagesRef, {
        role: 'user',
        content: userInput,
        timestamp: serverTimestamp(),
        userId: 'anonymous' // Could be auth.currentUser.uid if logged in
      });

      // 2. Generate AI response
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, { role: 'user', content: userInput }].map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        config: {
          systemInstruction: "You are Helios, a professional home energy advisor for UK homeowners. Your goal is to provide unbiased, evidence-based insights on solar panels, batteries, EV chargers, and heat pumps. Be helpful, concise, and prioritize the homeowner's ROI and mission of reducing noise in the energy market. Always mention UK-specific grants like ECO4, HES, or BUS when relevant.",
        },
      });

      const modelContent = response.text || "I'm sorry, I couldn't generate a response. Please try again.";

      // 3. Save AI response to Firestore
      await addDoc(messagesRef, {
        role: 'model',
        content: modelContent,
        timestamp: serverTimestamp(),
        userId: 'helios'
      });
    } catch (error) {
      console.error("AI Chat Error:", error);
      // We don't need to manually set messages here because onSnapshot will handle it if it succeeded,
      // but if it failed completely, we might want to alert the user.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '60px' : '600px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "glass w-[calc(100vw-3rem)] sm:w-[400px] mb-4 flex flex-col overflow-hidden transition-all duration-300 shadow-2xl rounded-3xl border-brand-yellow/20",
              isMinimized ? "h-[64px]" : "h-[600px]"
            )}
          >
            {/* Header */}
            <div className="p-4 bg-brand-yellow flex items-center justify-between text-brand-black">
              <div className="flex items-center space-x-2">
                <Sparkles size={20} />
                <span className="font-bold">Ask Helios Anything</span>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-brand-black/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-brand-black/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div 
                  ref={scrollRef}
                  className="flex-grow overflow-y-auto p-4 space-y-4 bg-white/50 dark:bg-brand-black/50"
                >
                  {messages.map((m, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "flex w-full",
                        m.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={cn(
                        "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed",
                        m.role === 'user' 
                          ? "bg-brand-yellow text-brand-black font-medium" 
                          : "bg-white dark:bg-zinc-800 shadow-sm border dark:border-white/5"
                      )}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm flex items-center space-x-2">
                        <Loader2 className="animate-spin text-brand-yellow" size={16} />
                        <span className="text-xs text-brand-grey">Helios is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t dark:border-white/5 bg-white dark:bg-brand-black">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about solar, tariffs, or grants..."
                      className="flex-grow bg-brand-grey-light/20 dark:bg-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="bg-brand-black dark:bg-brand-yellow dark:text-brand-black p-3 rounded-xl disabled:opacity-50 transition-all hover:scale-105"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={cn(
          "bg-brand-yellow text-brand-black p-4 rounded-2xl shadow-xl flex items-center space-x-2 font-bold",
          isOpen && "hidden"
        )}
      >
        <MessageSquare size={24} />
        <span className="pr-2">Ask Helios</span>
      </motion.button>
    </div>
  );
}
