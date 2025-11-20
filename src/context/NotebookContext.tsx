import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Highlight {
    id: string;
    conceptId: string;
    text: string;
    note?: string;
    color: 'yellow' | 'green' | 'blue' | 'pink';
    timestamp: number;
}

interface NotebookContextType {
    highlights: Highlight[];
    addHighlight: (conceptId: string, text: string, color?: Highlight['color'], note?: string) => void;
    removeHighlight: (id: string) => void;
    updateNote: (id: string, note: string) => void;
    getHighlightsByConcept: (conceptId: string) => Highlight[];
    exportNotes: () => void;
}

const NotebookContext = createContext<NotebookContextType | undefined>(undefined);

export const NotebookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [highlights, setHighlights] = useState<Highlight[]>(() => {
        const saved = localStorage.getItem('bamatext_highlights');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('bamatext_highlights', JSON.stringify(highlights));
    }, [highlights]);

    const addHighlight = (conceptId: string, text: string, color: Highlight['color'] = 'yellow', note?: string) => {
        const newHighlight: Highlight = {
            id: crypto.randomUUID(),
            conceptId,
            text,
            color,
            note,
            timestamp: Date.now()
        };
        setHighlights(prev => [...prev, newHighlight]);
    };

    const removeHighlight = (id: string) => {
        setHighlights(prev => prev.filter(h => h.id !== id));
    };

    const updateNote = (id: string, note: string) => {
        setHighlights(prev => prev.map(h => h.id === id ? { ...h, note } : h));
    };

    const getHighlightsByConcept = (conceptId: string) => {
        return highlights.filter(h => h.conceptId === conceptId);
    };

    const exportNotes = () => {
        const notesText = highlights.map(h => {
            const date = new Date(h.timestamp).toLocaleDateString();
            return `## Concept: ${h.conceptId} (${date})\n> "${h.text}"\n\nNote: ${h.note || '(No note)'}\n---\n`;
        }).join('\n');

        const blob = new Blob([notesText], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-textbook-notes.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <NotebookContext.Provider value={{ highlights, addHighlight, removeHighlight, updateNote, getHighlightsByConcept, exportNotes }}>
            {children}
        </NotebookContext.Provider>
    );
};

export const useNotebook = () => {
    const context = useContext(NotebookContext);
    if (context === undefined) {
        throw new Error('useNotebook must be used within a NotebookProvider');
    }
    return context;
};
