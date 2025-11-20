export type EventType = "VIEW_CONCEPT" | "ANSWER_SUBMIT" | "HINT_REQUEST" | "AI_TUTOR_MESSAGE" | "SIMULATION_CHANGE";

export interface LogEntry {
    id: string;
    timestamp: number;
    eventType: EventType;
    conceptId?: string;
    exerciseId?: string;
    payload?: Record<string, unknown>;
}

export interface Concept {
    id: string;
    title: string;
    description: string;
    content: string; // Markdown or HTML content
    tags: string[];
    difficulty: "easy" | "medium" | "hard";
    prerequisiteIds: string[];
}

export interface Subunit {
    id: string;
    title: string;
    conceptIds: string[];
}

export interface Unit {
    id: string;
    title: string;
    subunits: Subunit[];
}

export interface Exercise {
    id: string;
    conceptId: string;
    prompt: string;
    choices?: string[]; // For multiple choice
    correctAnswer: string;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
    type: "multiple-choice" | "short-answer";
    hints?: string[]; // Multi-stage hints
    distractorFeedback?: Record<string, string>; // Specific feedback for wrong answers
}

export interface Misconception {
    id: string;
    description: string;
    correction: string;
}

export type AffectiveState = "bored" | "frustrated" | "confused" | "flow" | "neutral";

export interface StudentConceptState {
    conceptId: string;
    masteryLevel: "struggling" | "in-progress" | "mastered";
    masteryScore: number; // 0-100
    consecutiveCorrect: number;
    accuracy: number; // 0-1
    attempts: number;
    hintsUsed: number;
    avgResponseTimeMs: number;

    // New dimensions
    activeMisconceptions: string[]; // IDs of misconceptions
    affectiveState: AffectiveState;
}

export interface StudentState {
    concepts: Record<string, StudentConceptState>;
    currentUnitId: string;
    currentSubunitId: string;
    currentConceptId: string;
}

export type AdaptiveActionType = "SHOW_EASIER_EXERCISE" | "SHOW_HARDER_EXERCISE" | "SHOW_EXTRA_EXPLANATION" | "SUGGEST_NEXT_CONCEPT" | "TRIGGER_AI_HINT";

export interface AdaptiveAction {
    type: AdaptiveActionType;
    targetConceptId?: string;
    targetExerciseId?: string;
    notes?: string;
}

export interface AiTutorResponse {
    message: string;
    tone: "supportive" | "neutral" | "challenging";
    suggestedAction?: AdaptiveAction;
    referencedConceptIds?: string[];
}
