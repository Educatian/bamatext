import React, { useState, useEffect, useRef } from 'react';
import { useStudent } from '../context/StudentContext';
import { concepts } from '../data/content';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { generateResponse, type ChatMessage } from '../services/llm';

export const AiTutorPanel: React.FC = () => {
    const { studentState, lastAction } = useStudent();
    const currentConcept = concepts[studentState.currentConceptId];

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "Hi! I'm your AI Tutor. I can help you understand Physics concepts. Ask me anything!" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // React to adaptive actions (System Initiated Messages)
    useEffect(() => {
        if (lastAction?.type === 'TRIGGER_AI_HINT') {
            const hintMsg: ChatMessage = {
                role: 'model',
                text: "I noticed you're having some trouble. Remember, $F=ma$ means force is directly proportional to acceleration."
            };
            setMessages(prev => [...prev, hintMsg]);
        } else if (lastAction?.type === 'SUGGEST_NEXT_CONCEPT') {
            const nextMsg: ChatMessage = {
                role: 'model',
                text: "Great job! You seem to have mastered this. Ready to move on to the next concept?"
            };
            setMessages(prev => [...prev, nextMsg]);
        }
    }, [lastAction]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const apiKey = localStorage.getItem('gemini_api_key');

        if (!apiKey) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'model',
                    text: "Please set your Google Gemini API Key in the Settings menu (gear icon) to enable my brain!"
                }]);
                setIsTyping(false);
            }, 500);
            return;
        }

        try {
            // Pass the FULL history including the new user message
            const fullHistory = [...messages, userMsg];
            const responseText = await generateResponse(apiKey, fullHistory, currentConcept, studentState, lastAction);

            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please check your API key." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    AI Tutor
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-200 px-2 py-1 rounded">
                    POWERED BY GEMINI
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={clsx(
                        "flex gap-3 max-w-[90%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}>
                        <div className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'user' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                        )}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={clsx(
                            "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.role === 'user'
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                        )}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3 max-w-[90%]">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                            <div className="flex gap-1 px-1">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
