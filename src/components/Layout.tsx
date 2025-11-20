import React, { useState } from 'react';
import { BookOpen, Activity, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';
import { TextbookView } from './TextbookView';
import { ActivityPanel } from './ActivityPanel';
import { AiTutorPanel } from './AiTutorPanel';
import { SettingsModal } from './SettingsModal';
import { useAuth } from '../context/AuthContext';
import { OpenLearnerModel } from './OpenLearnerModel';

export const Layout: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'textbook' | 'activity'>('textbook');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [leftWidth, setLeftWidth] = useState(60); // Percentage
    const [isDragging, setIsDragging] = useState(false);
    const { user, logout } = useAuth();

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const sidebarWidth = 80; // Approximate width of ProgressIndicator
            const containerWidth = window.innerWidth - sidebarWidth;
            const newLeftWidth = ((e.clientX - sidebarWidth) / containerWidth) * 100;

            // Clamp between 20% and 80%
            if (newLeftWidth > 20 && newLeftWidth < 80) {
                setLeftWidth(newLeftWidth);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden select-none">
            {/* Sidebar */}
            <ProgressIndicator />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            B
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">BamaText <span className="text-slate-400 font-normal text-sm ml-2">Adaptive Physics</span></h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Auth Status */}
                        {user ? (
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                                <UserIcon className="w-4 h-4" />
                                <span className="max-w-[100px] truncate">{user.email}</span>
                                <button onClick={logout} title="Logout" className="ml-2 text-slate-400 hover:text-red-500">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : null}

                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('textbook')}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'textbook' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <BookOpen className="w-4 h-4" />
                                Textbook
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'activity' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Activity className="w-4 h-4" />
                                Practice
                            </button>
                        </div>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Dashboard Flex Layout */}
                <main className="flex-1 flex overflow-hidden relative">
                    {/* Left Panel: Textbook Content */}
                    <div style={{ width: `${leftWidth}%` }} className="h-full min-w-0 overflow-y-auto border-r border-slate-200">
                        {activeTab === 'textbook' ? <TextbookView /> : <ActivityPanel />}
                    </div>

                    {/* Resizer Handle */}
                    <div
                        className={`w-1.5 hover:w-2 cursor-col-resize flex items-center justify-center transition-all z-10 relative -ml-[3px] ${isDragging ? 'bg-blue-500 w-2' : 'bg-transparent hover:bg-blue-400/50'}`}
                        onMouseDown={handleMouseDown}
                    >
                        {/* Visual handle indicator */}
                        <div className="h-8 w-1 bg-slate-300 rounded-full" />
                    </div>

                    {/* Right Panel: AI Tutor & OLM */}
                    <div style={{ width: `${100 - leftWidth}%` }} className="flex flex-col h-full min-w-0 bg-white">
                        {/* OLM Section */}
                        <div className="shrink-0 border-b border-slate-200 p-4 bg-slate-50">
                            <OpenLearnerModel />
                        </div>

                        {/* AI Tutor Section */}
                        <div className="flex-1 min-h-0 relative">
                            <AiTutorPanel />
                        </div>
                    </div>
                </main>
            </div>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};
