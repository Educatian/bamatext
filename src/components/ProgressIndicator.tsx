import React from 'react';
import { useStudent } from '../context/StudentContext';
import { units, concepts } from '../data/content';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const ProgressIndicator: React.FC = () => {
    const { studentState, setCurrentConcept } = useStudent();

    return (
        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full">
            <div className="p-4 border-b border-slate-200">
                <h2 className="font-bold text-slate-800">Course Map</h2>
                <p className="text-xs text-slate-500">Dynamics 101</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {units.map(unit => (
                    <div key={unit.id}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            {unit.title}
                        </h3>
                        <div className="space-y-4">
                            {unit.subunits.map(subunit => (
                                <div key={subunit.id}>
                                    <div className="text-sm font-medium text-slate-700 mb-2 pl-2 border-l-2 border-slate-300">
                                        {subunit.title}
                                    </div>
                                    <div className="space-y-1">
                                        {subunit.conceptIds.map(conceptId => {
                                            const concept = concepts[conceptId];
                                            const state = studentState.concepts[conceptId] as import('../data/types').StudentConceptState | undefined;
                                            const isActive = studentState.currentConceptId === conceptId;
                                            const status: "struggling" | "in-progress" | "mastered" | "pending" = state?.masteryLevel || 'pending';

                                            return (
                                                <button
                                                    key={conceptId}
                                                    onClick={() => setCurrentConcept(conceptId)}
                                                    className={clsx(
                                                        "w-full px-3 py-2 rounded-md text-sm transition-colors text-left group",
                                                        isActive ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-slate-100"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            {status === 'mastered' && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                                                            {status === 'struggling' && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                                                            {status === 'in-progress' && <Circle className="w-4 h-4 text-blue-400 shrink-0" />}
                                                            {status === 'pending' && <Circle className="w-4 h-4 text-slate-300 shrink-0" />}
                                                            <span className={clsx("truncate font-medium", isActive ? "text-blue-700" : "text-slate-600")}>
                                                                {concept.title}
                                                            </span>
                                                        </div>
                                                        {state?.masteryScore !== undefined && state.masteryScore > 0 && (
                                                            <span className="text-[10px] font-bold text-slate-400">
                                                                {Math.round(state.masteryScore)}%
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="w-full bg-slate-200 rounded-full h-1 mt-1 overflow-hidden">
                                                        <div
                                                            className={clsx(
                                                                "h-full rounded-full transition-all duration-500",
                                                                status === 'mastered' ? "bg-green-500" :
                                                                    status === 'struggling' ? "bg-amber-500" : "bg-blue-500"
                                                            )}
                                                            style={{ width: `${state?.masteryScore || 0}%` }}
                                                        />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-100">
                <div className="text-xs font-medium text-slate-500 mb-2">Legend</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Mastered</div>
                    <div className="flex items-center gap-1"><Circle className="w-3 h-3 text-blue-400" /> In Progress</div>
                    <div className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-500" /> Struggling</div>
                    <div className="flex items-center gap-1"><Circle className="w-3 h-3 text-slate-300" /> Pending</div>
                </div>
            </div>
        </div>
    );
};
