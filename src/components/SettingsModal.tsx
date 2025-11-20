import React, { useState, useEffect } from 'react';
import { X, Save, Key, Database } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [supabaseUrl, setSupabaseUrl] = useState('');
    const [supabaseKey, setSupabaseKey] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [testMsg, setTestMsg] = useState('');

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) setApiKey(storedKey);

        const storedUrl = localStorage.getItem('supabase_url');
        if (storedUrl) setSupabaseUrl(storedUrl);

        const storedSbKey = localStorage.getItem('supabase_key');
        if (storedSbKey) setSupabaseKey(storedSbKey);
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        localStorage.setItem('supabase_url', supabaseUrl);
        localStorage.setItem('supabase_key', supabaseKey);
        onClose();
        window.location.reload(); // Reload to re-init services
    };

    const testGemini = async () => {
        setStatus('idle');
        setTestMsg('Testing Gemini...');
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const hasFlash2 = data.models?.some((m: any) => m.name.includes('gemini-2.0-flash'));
            if (hasFlash2) {
                setStatus('success');
                setTestMsg('Success! gemini-2.0-flash is available.');
            } else {
                setStatus('success');
                setTestMsg('Connected, but gemini-2.0-flash not found. Using available models.');
            }
        } catch (e: any) {
            setStatus('error');
            setTestMsg(e.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Key className="w-5 h-5 text-blue-600" />
                        Settings
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Gemini Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Google Gemini API Key
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIza..."
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            <button
                                onClick={testGemini}
                                className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
                            >
                                Test
                            </button>
                        </div>
                    </div>

                    {/* Supabase Section */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-800">
                            <Database className="w-4 h-4" />
                            Database (Supabase)
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Project URL
                                </label>
                                <input
                                    type="text"
                                    value={supabaseUrl}
                                    onChange={(e) => setSupabaseUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Anon Key
                                </label>
                                <input
                                    type="password"
                                    value={supabaseKey}
                                    onChange={(e) => setSupabaseKey(e.target.value)}
                                    placeholder="eyJ..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-800">
                            <Key className="w-4 h-4" />
                            Security
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Update Password
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        id="new-password"
                                    />
                                    <button
                                        onClick={async () => {
                                            const input = document.getElementById('new-password') as HTMLInputElement;
                                            if (!input.value) return;
                                            try {
                                                const { updatePassword } = await import('../services/supabase');
                                                await updatePassword(input.value);
                                                alert("Password updated successfully!");
                                                input.value = '';
                                            } catch (e: any) {
                                                alert("Error: " + e.message);
                                            }
                                        }}
                                        className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {status !== 'idle' && (
                        <div className={`text-sm p-2 rounded ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {testMsg}
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save & Reload
                    </button>
                </div>
            </div>
        </div>
    );
};
