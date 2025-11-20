import { describe, it, expect, vi } from 'vitest';
import { generateResponse } from './llm';
import type { ChatMessage } from './llm';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock GoogleGenerativeAI
vi.mock('@google/generative-ai', () => {
    const sendMessageMock = vi.fn().mockResolvedValue({
        response: { text: () => 'Mocked AI response' }
    });
    const startChatMock = vi.fn().mockReturnValue({
        sendMessage: sendMessageMock
    });
    const getGenerativeModelMock = vi.fn().mockReturnValue({
        startChat: startChatMock
    });

    // Mock the class constructor
    const GoogleGenerativeAIMock = vi.fn(function (_apiKey: string) {
        return {
            getGenerativeModel: getGenerativeModelMock
        };
    });

    return {
        GoogleGenerativeAI: GoogleGenerativeAIMock
    };
});

describe('generateResponse', () => {
    const mockApiKey = 'test-api-key';
    const mockHistory: ChatMessage[] = [
        { role: 'user', text: 'Hello' },
        { role: 'model', text: 'Hi there' },
        { role: 'user', text: 'How does gravity work?' }
    ];

    const mockConcept = {
        id: 'c1',
        title: 'Gravity',
        description: 'Force between masses',
        prerequisites: [],
        content: 'Gravity content',
        tags: ['physics'],
        difficulty: 'easy' as const,
        prerequisiteIds: []
    };
    const mockStudentState = {
        concepts: {},
        recentActions: [],
        currentUnitId: 'u1',
        currentSubunitId: 's1',
        currentConceptId: 'c1'
    };

    it('should initialize Gemini API with provided key', async () => {
        await generateResponse(mockApiKey, mockHistory, mockConcept, mockStudentState, null);
        expect(GoogleGenerativeAI).toHaveBeenCalledWith(mockApiKey);
    });

    it('should call sendMessage with the last user message', async () => {
        const result = await generateResponse(mockApiKey, mockHistory, mockConcept, mockStudentState, null);
        expect(result).toBe('Mocked AI response');

        // Get the mock instance
        const genAI = new GoogleGenerativeAI(mockApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const chat = model.startChat({});

        expect(chat.sendMessage).toHaveBeenCalledWith('How does gravity work?');
    });

    it('should return error if last message is not from user', async () => {
        const invalidHistory: ChatMessage[] = [{ role: 'model', text: 'Bot message' }];
        const result = await generateResponse(mockApiKey, invalidHistory, mockConcept, mockStudentState, null);
        expect(result).toContain('Error: Last message must be from user');
    });
});
