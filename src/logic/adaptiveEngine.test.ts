import { describe, it, expect } from 'vitest';
import { getRecommendation, generateAiTutorResponse } from './adaptiveEngine';
import type { Concept, StudentState } from '../data/types';

const mockConcept: Concept = {
    id: 'c1',
    title: 'Test Concept',
    description: 'Test Description',
    content: 'Test Content',
    tags: [],
    difficulty: 'easy',
    prerequisiteIds: []
};

const mockState: StudentState = {
    concepts: {},
    currentUnitId: 'u1',
    currentSubunitId: 's1',
    currentConceptId: 'c1'
};

describe('adaptiveEngine', () => {
    it('should recommend easier exercise when student is struggling', () => {
        const strugglingState: StudentState = {
            ...mockState,
            concepts: {
                'c1': {
                    conceptId: 'c1',
                    masteryLevel: 'struggling',
                    masteryScore: 20,
                    consecutiveCorrect: 0,
                    accuracy: 0.2,
                    attempts: 5,
                    hintsUsed: 2,
                    avgResponseTimeMs: 5000,
                    activeMisconceptions: [],
                    affectiveState: 'frustrated'
                }
            }
        };

        const actions = getRecommendation(strugglingState, mockConcept);
        expect(actions).toContainEqual(expect.objectContaining({ type: 'SHOW_EASIER_EXERCISE' }));
        expect(actions).toContainEqual(expect.objectContaining({ type: 'TRIGGER_AI_HINT' }));
    });

    it('should suggest next concept when student has mastered content', () => {
        const masteredState: StudentState = {
            ...mockState,
            concepts: {
                'c1': {
                    conceptId: 'c1',
                    masteryLevel: 'mastered',
                    masteryScore: 90,
                    consecutiveCorrect: 5,
                    accuracy: 0.9,
                    attempts: 3,
                    hintsUsed: 0,
                    avgResponseTimeMs: 2000,
                    activeMisconceptions: [],
                    affectiveState: 'flow'
                }
            }
        };

        const actions = getRecommendation(masteredState, mockConcept);
        expect(actions).toContainEqual(expect.objectContaining({ type: 'SUGGEST_NEXT_CONCEPT' }));
    });

    it('should generate a supportive AI response for help requests', () => {
        const response = generateAiTutorResponse(mockConcept, mockState, "I need help");
        expect(response.tone).toBe('supportive');
        expect(response.message).toContain('Test Description');
    });
});
