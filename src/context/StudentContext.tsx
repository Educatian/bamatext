import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { StudentState, LogEntry, EventType, AdaptiveAction, AffectiveState } from '../data/types';
import { getRecommendation } from '../logic/adaptiveEngine';
import { concepts, units } from '../data/content';
import { useAuth } from './AuthContext';
import { saveStudentState, loadStudentState, logRemoteEvent } from '../services/supabase';

interface StudentContextType {
    studentState: StudentState;
    history: LogEntry[];
    lastAction: AdaptiveAction | null;
    submitAnswer: (conceptId: string, exerciseId: string, isCorrect: boolean, timeSpentMs: number, hintsUsed: number) => void;
    logEvent: (eventType: EventType, payload?: Record<string, unknown>) => void;
    setCurrentConcept: (conceptId: string) => void;
}

const defaultState: StudentState = {
    concepts: {},
    currentUnitId: units[0].id,
    currentSubunitId: units[0].subunits[0].id,
    currentConceptId: units[0].subunits[0].conceptIds[0],
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [studentState, setStudentState] = useState<StudentState>(defaultState);
    const [history, setHistory] = useState<LogEntry[]>([]);
    const [lastAction, setLastAction] = useState<AdaptiveAction | null>(null);
    const { user } = useAuth();
    const isInitialLoad = useRef(true);

    // Load state from Supabase on login
    useEffect(() => {
        if (user) {
            loadStudentState(user.id).then(remoteState => {
                if (remoteState) {
                    console.log("Loaded remote state:", remoteState);
                    setStudentState(remoteState);
                }
            });
        }
    }, [user]);

    // Save state to Supabase on change (debounced slightly by effect nature)
    useEffect(() => {
        if (user && !isInitialLoad.current) {
            const timeoutId = setTimeout(() => {
                saveStudentState(user.id, studentState);
            }, 1000); // Debounce save by 1s
            return () => clearTimeout(timeoutId);
        }
        isInitialLoad.current = false;
    }, [studentState, user]);

    const logEvent = (eventType: EventType, payload?: Record<string, unknown>) => {
        const entry: LogEntry = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            eventType,
            conceptId: studentState.currentConceptId,
            payload
        };
        setHistory(prev => [...prev, entry]);
        console.log('[LOG]', entry);

        // Sync log to Supabase
        if (user) {
            logRemoteEvent(user.id, entry);
        }
    };

    const setCurrentConcept = (conceptId: string) => {
        setStudentState(prev => ({ ...prev, currentConceptId: conceptId }));
        logEvent("VIEW_CONCEPT", { conceptId });
    };

    const submitAnswer = (conceptId: string, exerciseId: string, isCorrect: boolean, timeSpentMs: number, hintsUsed: number) => {
        // 1. Update Student State
        setStudentState(prev => {
            const prevConceptState = prev.concepts[conceptId] || {
                conceptId,
                masteryLevel: 'in-progress',
                masteryScore: 0,
                consecutiveCorrect: 0,
                accuracy: 0,
                attempts: 0,
                hintsUsed: 0,
                avgResponseTimeMs: 0,
                activeMisconceptions: [],
                affectiveState: 'neutral'
            };

            const newAttempts = prevConceptState.attempts + 1;
            const newAccuracy = ((prevConceptState.accuracy * prevConceptState.attempts) + (isCorrect ? 1 : 0)) / newAttempts;
            const newAvgTime = ((prevConceptState.avgResponseTimeMs * prevConceptState.attempts) + timeSpentMs) / newAttempts;
            const newHints = prevConceptState.hintsUsed + hintsUsed;

            // Mastery Score Calculation
            let newMasteryScore = prevConceptState.masteryScore;
            let newConsecutive = prevConceptState.consecutiveCorrect;

            if (isCorrect) {
                newMasteryScore = Math.min(100, newMasteryScore + 10);
                newConsecutive += 1;
            } else {
                newMasteryScore = Math.max(0, newMasteryScore - 5);
                newConsecutive = 0;
            }

            // Determine Level based on Score
            let masteryLevel = prevConceptState.masteryLevel;
            if (newMasteryScore >= 80) masteryLevel = 'mastered';
            else if (newMasteryScore < 40 && newAttempts >= 3) masteryLevel = 'struggling';
            else masteryLevel = 'in-progress';

            const newState = {
                ...prev,
                concepts: {
                    ...prev.concepts,
                    [conceptId]: {
                        ...prevConceptState,
                        accuracy: newAccuracy,
                        attempts: newAttempts,
                        avgResponseTimeMs: newAvgTime,
                        hintsUsed: newHints,
                        masteryLevel,
                        masteryScore: newMasteryScore,
                        consecutiveCorrect: newConsecutive,
                        // Simple heuristic for affective state
                        affectiveState: (timeSpentMs > 10000 && !isCorrect ? 'frustrated' : 'neutral') as AffectiveState,
                        activeMisconceptions: prevConceptState.activeMisconceptions // Placeholder for now
                    }
                }
            };

            // 3. Get Recommendation (using the NEW state)
            const currentConcept = concepts[conceptId];
            if (currentConcept) {
                const actions = getRecommendation(newState, currentConcept);
                if (actions.length > 0) {
                    setLastAction(actions[0]); // Just take the first one for now
                    logEvent("AI_TUTOR_MESSAGE", { action: actions[0] });
                }
            }

            return newState;
        });

        // 2. Log Event
        logEvent("ANSWER_SUBMIT", { conceptId, exerciseId, isCorrect, timeSpentMs, hintsUsed });
    };

    return (
        <StudentContext.Provider value={{ studentState, history, lastAction, submitAnswer, logEvent, setCurrentConcept }}>
            {children}
        </StudentContext.Provider>
    );
};

export const useStudent = () => {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error("useStudent must be used within a StudentProvider");
    }
    return context;
};
