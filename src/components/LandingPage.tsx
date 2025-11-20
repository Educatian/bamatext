import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signInWithOAuth, signInWithPassword, signUpWithPassword } from '../services/supabase';
import { Sparkles, BookOpen, Activity, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authMode, setAuthMode] = useState<'magic' | 'password'>('magic');
    const [isSignUp, setIsSignUp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            if (authMode === 'magic') {
                await login(email);
                setSent(true);
            } else {
                if (isSignUp) {
                    await signUpWithPassword(email, password);
                    alert("Account created! Please check your email to confirm.");
                } else {
                    await signInWithPassword(email, password);
                    // AuthContext listener will handle redirect
                }
            }
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOAuth = async (provider: 'google' | 'github') => {
        try {
            await signInWithOAuth(provider);
        } catch (error: any) {
            alert("OAuth Error: " + error.message);
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
                    <div className="max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                        <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
                            <button
                                onClick={() => setAuthMode('magic')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMode === 'magic' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Magic Link
                            </button>
                            <button
                                onClick={() => setAuthMode('password')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMode === 'password' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Password
                            </button>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            {authMode === 'password' && (
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {authMode === 'magic' ? 'Send Magic Link' : (isSignUp ? 'Sign Up' : 'Sign In')} <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {authMode === 'password' && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-sm text-slate-500 hover:text-blue-600 underline"
                                >
                                    {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
                                </button>
                            </div>
                        )}

                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px bg-slate-200 flex-1" />
                            <span className="text-xs text-slate-400 font-medium uppercase">Or continue with</span>
                            <div className="h-px bg-slate-200 flex-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleOAuth('google')}
                                className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button
                                onClick={() => handleOAuth('github')}
                                className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                GitHub
                            </button>
                        </div>
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
