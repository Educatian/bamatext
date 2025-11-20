import React, { useEffect, useState } from 'react';
import { fetchAllProfiles, fetchRecentLogs, fetchDailyStats } from '../services/supabase';
import { Users, Activity, GraduationCap, Clock, ArrowLeft, BarChart3 } from 'lucide-react';
import type { StudentState } from '../data/types';

interface Profile {
    id: string;
    updated_at: string;
    student_state: StudentState;
}

interface Log {
    id: string;
    user_id: string;
    event_type: string;
    payload: any;
    created_at: string;
}

interface DailyStat {
    date: string;
    total_users: number;
    active_users_today: number;
    avg_mastery_score: number;
}

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);
    const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [profilesData, logsData, statsData] = await Promise.all([
                fetchAllProfiles(),
                fetchRecentLogs(100),
                fetchDailyStats()
            ]);
            setProfiles(profilesData as Profile[]);
            setLogs(logsData as Log[]);
            setDailyStats(statsData as DailyStat[]);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-500">Loading Analytics...</div>
            </div>
        );
    }

    // Calculate Stats
    const totalUsers = profiles.length;
    const activeToday = profiles.filter(p => {
        const date = new Date(p.updated_at);
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
    }).length;

    // Calculate Average Mastery across all concepts for all users
    let totalMastery = 0;
    let conceptCount = 0;
    profiles.forEach(p => {
        if (p.student_state?.concepts) {
            Object.values(p.student_state.concepts).forEach(c => {
                totalMastery += c.masteryScore || 0;
                conceptCount++;
            });
        }
    });
    const avgMastery = conceptCount > 0 ? Math.round(totalMastery / conceptCount) : 0;

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500">System Analytics & User Engagement</p>
                    </div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to App
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 font-medium">Total Users</div>
                                <div className="text-2xl font-bold text-slate-900">{totalUsers}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 font-medium">Active Today</div>
                                <div className="text-2xl font-bold text-slate-900">{activeToday}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 font-medium">Avg. Mastery</div>
                                <div className="text-2xl font-bold text-slate-900">{avgMastery}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Engagement Chart (Daily Stats) */}
                {dailyStats.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <BarChart3 className="w-5 h-5 text-slate-400" />
                            Engagement Trends (Last 30 Days)
                        </h2>
                        <div className="h-48 flex items-end gap-2">
                            {dailyStats.map(stat => (
                                <div key={stat.date} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors relative"
                                        style={{ height: `${Math.max(10, (stat.active_users_today / Math.max(...dailyStats.map(d => d.active_users_today))) * 100)}%` }}
                                    >
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {stat.active_users_today} Active Users
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-slate-400 rotate-45 origin-top-left mt-2">
                                        {new Date(stat.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activity Feed */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-slate-400" />
                                Recent Activity
                            </h2>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {logs.map(log => (
                                <div key={log.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                                            {log.event_type}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {new Date(log.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600 font-mono truncate">
                                        User: {log.user_id.slice(0, 8)}...
                                    </div>
                                    {log.payload && (
                                        <pre className="mt-2 text-[10px] bg-slate-900 text-slate-300 p-2 rounded overflow-x-auto">
                                            {JSON.stringify(log.payload, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* User List */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="font-bold text-slate-800">User Progress</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="p-4">User ID</th>
                                        <th className="p-4">Last Active</th>
                                        <th className="p-4">Current Concept</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {profiles.map(profile => (
                                        <tr key={profile.id} className="hover:bg-slate-50">
                                            <td className="p-4 font-mono text-slate-600">
                                                {profile.id.slice(0, 8)}...
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {new Date(profile.updated_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {profile.student_state?.currentConceptId || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
