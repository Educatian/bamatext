/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { exercises } from '../data/content';
import { SimulationWidget } from './SimulationWidget';
import { Check, X, HelpCircle, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

export const ActivityPanel: React.FC = () => {
    const { studentState, submitAnswer, lastAction } = useStudent();
    const currentExercises = exercises[studentState.currentConceptId] || [];

    // Local state for the current exercise being viewed
    const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [hintsRevealed, setHintsRevealed] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());

    useEffect(() => {
        setActiveExerciseIndex(0);
        setSelectedChoice(null);
        setFeedback(null);
        setHintsRevealed(0);
        setStartTime(Date.now());
    }, [studentState.currentConceptId]);

    // React to adaptive actions
    useEffect(() => {
        if (lastAction?.type === 'SHOW_EASIER_EXERCISE') {
            // Logic to switch exercise could go here
        } else if (lastAction?.type === 'TRIGGER_AI_HINT') {
            setHintsRevealed(prev => Math.min(prev + 1, exercise?.hints?.length || 0));
        }
    }, [lastAction]);

    const handleCheck = () => {
        if (!selectedChoice) return;

        const exercise = currentExercises[activeExerciseIndex];
        const isCorrect = selectedChoice === exercise.correctAnswer;
        const timeSpent = Date.now() - startTime;

        setFeedback(isCorrect ? 'correct' : 'incorrect');
        submitAnswer(studentState.currentConceptId, exercise.id, isCorrect, timeSpent, hintsRevealed);
    };

    const handleNext = () => {
        if (activeExerciseIndex < currentExercises.length - 1) {
            setActiveExerciseIndex(prev => prev + 1);
            setSelectedChoice(null);
            setFeedback(null);
            setHintsRevealed(0);
            setStartTime(Date.now());
        }
    };

    // Ensure index is within bounds (in case exercises changed)
    if (activeExerciseIndex >= currentExercises.length && currentExercises.length > 0) {
        setActiveExerciseIndex(0);
    }

    const exercise = currentExercises[activeExerciseIndex];

    return (
        <div className="flex flex-col h-full bg-slate-50 p-6 overflow-y-auto">
            <SimulationWidget />

            {currentExercises.length === 0 ? (
                <div className="p-4 text-slate-500">No exercises for this concept.</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-blue-500" />
                            Concept Check
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">
                            {activeExerciseIndex + 1} of {currentExercises.length}
                        </span>
                    </div>

                    <div className="mb-6">
                        <p className="text-lg text-slate-800 font-medium mb-4">{exercise?.prompt}</p>

                        <div className="space-y-3">
                            {exercise?.choices?.map((choice, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !feedback && setSelectedChoice(choice)}
                                    disabled={!!feedback}
                                    className={clsx(
                                        "w-full text-left p-4 rounded-lg border transition-all",
                                        selectedChoice === choice
                                            ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                                            : "border-slate-200 hover:bg-slate-50 text-slate-700",
                                        feedback === 'correct' && choice === exercise.correctAnswer && "!bg-green-50 !border-green-500 !text-green-700",
                                        feedback === 'incorrect' && selectedChoice === choice && "!bg-red-50 !border-red-500 !text-red-700"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold",
                                            selectedChoice === choice ? "border-blue-500 text-blue-500" : "border-slate-300 text-slate-400"
                                        )}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        {choice}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hints Section */}
                    {exercise?.hints && exercise.hints.length > 0 && !feedback && (
                        <div className="mb-6">
                            {hintsRevealed < exercise.hints.length && (
                                <button
                                    onClick={() => setHintsRevealed(prev => prev + 1)}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                    <HelpCircle className="w-4 h-4" />
                                    Need a hint? ({exercise.hints.length - hintsRevealed} remaining)
                                </button>
                            )}
                            <div className="space-y-2 mt-2">
                                {exercise.hints.slice(0, hintsRevealed).map((hint, idx) => (
                                    <div key={idx} className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800 animate-in fade-in slide-in-from-top-2">
                                        <span className="font-bold mr-1">Hint {idx + 1}:</span> {hint}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {feedback && (
                        <div className={clsx(
                            "p-4 rounded-lg mb-6 flex gap-3",
                            feedback === 'correct' ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                        )}>
                            {feedback === 'correct' ? <Check className="w-5 h-5 shrink-0" /> : <X className="w-5 h-5 shrink-0" />}
                            <div>
                                <p className="font-bold mb-1">{feedback === 'correct' ? "Correct!" : "Not quite."}</p>
                                <p className="text-sm opacity-90">
                                    {feedback === 'incorrect' && exercise?.distractorFeedback?.[selectedChoice!]
                                        ? exercise.distractorFeedback[selectedChoice!]
                                        : exercise?.explanation}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        {!feedback ? (
                            <button
                                onClick={handleCheck}
                                disabled={!selectedChoice}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Check Answer
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={activeExerciseIndex >= currentExercises.length - 1}
                                className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next Question <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
