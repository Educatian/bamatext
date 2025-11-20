import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, BookOpen, Activity, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            await login(email);
            setSent(true);
        } catch (error: any) {
            alert("Error logging in: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4 border border-slate-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Check your email!</h2>
                    <p className="text-slate-600">
                        We've sent a magic link to <span className="font-semibold text-slate-800">{email}</span>.
                        Click the link to sign in instantly.
                    </p>
                    <button
                        onClick={() => setSent(false)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-4"
                    >
                        Try a different email
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                        B
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight">BamaText</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wide">
                        <Sparkles className="w-3 h-3" />
                        New: AI Tutor Integration
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                        Master Physics with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Adaptive AI</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                        The textbook that adapts to you. Real-time mastery tracking, interactive simulations, and a Socratic AI tutor that helps you learn faster.
                    </p>

                    {/* Login Form */}
                    <div className="max-w-sm">
                        <form onSubmit={handleLogin} className="space-y-3">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email to start"
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Get Started <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-center text-slate-400">
                                No password required. We'll send you a magic link.
                            </p>
                        </form>
                    </div>
                </div>

                {/* Visual / Feature Grid */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl blur-3xl opacity-50 -z-10" />
                    <div className="grid gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 transform hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Adaptive Learning</h3>
                                <p className="text-sm text-slate-600">Content adjusts to your mastery level in real-time. Never get bored or overwhelmed.</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 transform hover:-translate-y-1 transition-transform duration-300 delay-75">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">AI Tutor</h3>
                                <p className="text-sm text-slate-600">Stuck? Ask the AI. It knows exactly what you're working on and guides you Socratically.</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 transform hover:-translate-y-1 transition-transform duration-300 delay-150">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Interactive Content</h3>
                                <p className="text-sm text-slate-600">Don't just read. Play with simulations and answer questions to prove your knowledge.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
