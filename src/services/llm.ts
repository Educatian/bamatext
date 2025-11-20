import { GoogleGenerativeAI } from "@google/generative-ai";
import type { StudentState, Concept, AdaptiveAction } from "../data/types";
export interface ChatMessage {
    role: "user" | "model";
    text: string;
}

const SYSTEM_PROMPT = `
You are an expert Physics Tutor for first-year engineering students. Your goal is to help students build intuition and deep understanding, not just solve problems.

**Pedagogical Approach: Socratic Method (Strict)**
1.  **NEVER give the answer directly.** If a student asks a question, guide them to the answer with a series of simple, leading questions.
2.  **Identify the gap.** Figure out *why* they are stuck. Is it a math issue? A conceptual misunderstanding?
3.  **One step at a time.** Ask only ONE question at a time. Wait for the student's response before moving on.
4.  **Check for misconceptions.** Common pitfalls in Dynamics include:
    -   Thinking force is needed for motion (it's needed for *acceleration*).
    -   Confusing velocity and acceleration.
    -   Ignoring reaction forces (Newton's 3rd Law).
5.  **Use LaTeX for math.** Always format equations using single '$' for inline math (e.g., $F=ma$) and double '$$' for block math.
6.  **Be concise.** Keep responses under 3-4 sentences unless explaining a complex derivation.
7.  **Context Aware.** You have access to the student's current concept and recent history. Use this to tailor your examples.

**Tone:** Encouraging, patient, and scientifically precise.
`;

export async function generateResponse(
    apiKey: string,
    history: ChatMessage[],
    currentConcept: Concept,
    studentState: StudentState,
    lastAction: AdaptiveAction | null
): Promise<string> {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Construct context
        const context = `
        Current Concept: ${currentConcept.title}
        Description: ${currentConcept.description}
        Student Mastery: ${studentState.concepts[currentConcept.id]?.masteryLevel || "pending"}
        Recent Action: ${lastAction?.type || "None"}
        `;

        // Start chat session
        /* const chat = model.startChat({ ... }); */

        // We only send the last message as the new input, assuming history is already passed
        // Actually, startChat takes history *excluding* the new message.
        // So we need to separate the last user message if we want to send it via sendMessage.
        // However, the caller usually appends the user message to history before calling this.
        // Let's assume 'history' contains the full conversation including the latest user message.

        const lastMsg = history[history.length - 1];
        if (lastMsg.role !== 'user') {
            return "Error: Last message must be from user.";
        }

        // Re-construct history for startChat (excluding the very last message which we send)
        const historyForChat = history.slice(0, -1).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        const chatSession = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT + "\n\nContext:\n" + context }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to act as the Physics Tutor." }],
                },
                ...historyForChat
            ] as any
        });

        const result = await chatSession.sendMessage(lastMsg.text);
        return result.response.text();

    } catch (error: unknown) {
        console.error("LLM Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return `Error: ${errorMessage}. Please check your API Key.`;
    }
}
