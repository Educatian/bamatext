import type { Concept, StudentState, AdaptiveAction, AiTutorResponse } from '../data/types';

export function getRecommendation(studentState: StudentState, currentConcept: Concept): AdaptiveAction[] {
    const conceptState = studentState.concepts[currentConcept.id];
    const actions: AdaptiveAction[] = [];

    if (!conceptState) return [];

    // Rule 1: Struggling -> Hint or Easier Content
    if (conceptState.masteryLevel === 'struggling') {
        actions.push({ type: "TRIGGER_AI_HINT", notes: "Student is struggling with accuracy < 40%" });
        if (conceptState.attempts > 5) {
            actions.push({ type: "SHOW_EASIER_EXERCISE", notes: "High failure rate" });
        }
    }
    // Rule 2: Mastered -> Suggest Next
    else if (conceptState.masteryLevel === 'mastered') {
        actions.push({ type: "SUGGEST_NEXT_CONCEPT", notes: "Mastery score > 80%" });
    }
    // Rule 3: In Progress
    else {
        // actions.push({ type: "SHOW_EASIER_EXERCISE", notes: "Continue practice" });
    }

    return actions;
}

export function generateAiTutorResponse(
    currentConcept: Concept,
    studentState: StudentState,
    userPrompt: string
): AiTutorResponse {
    const conceptState = studentState.concepts[currentConcept.id];
    const lowerPrompt = userPrompt.toLowerCase();

    // Mocked response logic
    let message = "";
    let tone: "supportive" | "neutral" | "challenging" = "neutral";
    let suggestedAction: AdaptiveAction | undefined;

    if (lowerPrompt.includes("hint") || lowerPrompt.includes("help")) {
        tone = "supportive";
        message = `Let's look at ${currentConcept.title}. Remember that ${currentConcept.description} Try breaking the problem down into smaller steps.`;
        if (currentConcept.id === 'c1') {
            message += " For Newton's Second Law, always start by drawing a Free Body Diagram.";
        }
    } else if (lowerPrompt.includes("explain") || lowerPrompt.includes("what is")) {
        tone = "neutral";
        message = `Here is a quick explanation: ${currentConcept.description}`;
    } else if (lowerPrompt.includes("next") || lowerPrompt.includes("done")) {
        if (conceptState && conceptState.masteryScore > 80) {
            tone = "challenging";
            message = "Great job! You seem to have mastered this. Ready for a harder challenge?";
            suggestedAction = { type: "SUGGEST_NEXT_CONCEPT" };
        } else {
            tone = "supportive";
            message = "I think you should practice a bit more on this concept before moving on.";
        }
    } else {
        message = "That's an interesting question. Based on what you're working on, try reviewing the key equations above.";
    }

    return {
        message,
        tone,
        suggestedAction,
        referencedConceptIds: [currentConcept.id]
    };
}
