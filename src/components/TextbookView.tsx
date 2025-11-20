import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useStudent } from '../context/StudentContext';
import { concepts, units } from '../data/content';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const TextbookView: React.FC = () => {
    const { studentState, setCurrentConcept } = useStudent();
    const currentConcept = concepts[studentState.currentConceptId];

    // Flatten all concept IDs to determine order
    const allConceptIds = useMemo(() => {
        return units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.conceptIds));
    }, []);

    const currentIndex = allConceptIds.indexOf(studentState.currentConceptId);
    const prevConceptId = currentIndex > 0 ? allConceptIds[currentIndex - 1] : null;
    const nextConceptId = currentIndex < allConceptIds.length - 1 ? allConceptIds[currentIndex + 1] : null;

    console.log('[TextbookView] Current Concept ID:', studentState.currentConceptId);
    console.log('[TextbookView] Current Concept:', currentConcept);

    if (!currentConcept) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>Concept not found: {studentState.currentConceptId}</p>
                <p>Please select a valid concept from the menu.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-8 bg-white shadow-sm rounded-xl border border-slate-100 flex flex-col">
            <div className="flex-1 max-w-3xl mx-auto prose prose-slate prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500">
                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2 block">
                    {currentConcept.difficulty}
                </span>
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        h1: ({ ...props }) => <h1 className="text-3xl font-bold text-slate-900 mb-6" {...props} />,
                        p: ({ ...props }) => <p className="text-slate-700 leading-relaxed mb-4" {...props} />,
                        li: ({ ...props }) => <li className="text-slate-700" {...props} />,
                    }}
                >
                    {currentConcept.content}
                </ReactMarkdown>
            </div>

            {/* Navigation Footer */}
            <div className="max-w-3xl mx-auto w-full mt-12 pt-6 border-t border-slate-100 flex justify-between items-center">
                <button
                    onClick={() => prevConceptId && setCurrentConcept(prevConceptId)}
                    disabled={!prevConceptId}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${prevConceptId
                        ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        : 'text-slate-300 cursor-not-allowed'
                        }`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                </button>

                <button
                    onClick={() => nextConceptId && setCurrentConcept(nextConceptId)}
                    disabled={!nextConceptId}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${nextConceptId
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    Next Concept
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
