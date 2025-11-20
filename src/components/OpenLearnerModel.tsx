import React from 'react';
import { useStudent } from '../context/StudentContext';
import { Brain, AlertTriangle, Smile, Frown, Meh } from 'lucide-react';
import { clsx } from 'clsx';

export const OpenLearnerModel: React.FC = () => {
    const { studentState } = useStudent();
    const conceptState = studentState.concepts[studentState.currentConceptId];

    if (!conceptState) return null;

    const getAffectiveIcon = () => {
        switch (conceptState.affectiveState) {
            case 'frustrated': return <Frown className="w-5 h-5 text-red-500" />;
            case 'bored': return <Meh className="w-5 h-5 text-yellow-500" />;
            case 'flow': return <Smile className="w-5 h-5 text-green-500" />;
            default: return <Smile className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800">My Learning Model</h3>
            </div>

            <div className="space-y-4">
                {/* Mastery Progress */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Mastery</span>
                        <span className="font-medium text-slate-900">
                            {Math.round(conceptState.accuracy * 100)}%
                        </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={clsx(
                                "h-full transition-all duration-500",
                                conceptState.masteryLevel === 'mastered' ? "bg-green-500" :
                                    conceptState.masteryLevel === 'struggling' ? "bg-red-400" : "bg-blue-500"
                            )}
                            style={{ width: `${conceptState.accuracy * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 capitalize">
                        Status: {conceptState.masteryLevel.replace('-', ' ')}
                    </p>
                </div>

                {/* Affective State */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                    <span className="text-sm text-slate-600">Current Mood</span>
                    <div className="flex items-center gap-2" title={conceptState.affectiveState}>
                        {getAffectiveIcon()}
                        <span className="text-sm font-medium capitalize text-slate-700">
                            {conceptState.affectiveState}
                        </span>
                    </div>
                </div>

                {/* Misconceptions */}
                {conceptState.activeMisconceptions.length > 0 && (
                    <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2 text-orange-700">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Areas to Review</span>
                        </div>
                        <ul className="space-y-1">
                            {conceptState.activeMisconceptions.map(id => (
                                <li key={id} className="text-xs text-orange-800 pl-2 border-l-2 border-orange-200">
                                    {/* In a real app, we'd look up the description */}
                                    Potential misconception detected ({id})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
