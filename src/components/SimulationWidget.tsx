import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';

export const SimulationWidget: React.FC = () => {
    const { logEvent, studentState } = useStudent();
    const [mass, setMass] = useState(10);
    const [force, setForce] = useState(50);
    const [acceleration, setAcceleration] = useState(5);

    useEffect(() => {
        const a = force / mass;
        setAcceleration(parseFloat(a.toFixed(2)));
    }, [mass, force]);

    // Only show simulation for Newton's Second Law for this prototype
    if (studentState.currentConceptId !== 'c1') {
        return null;
    }

    const handleChange = (type: 'mass' | 'force', value: number) => {
        if (type === 'mass') setMass(value);
        else setForce(value);

        // Debounce logging in a real app, but here we log on change for simplicity or maybe on mouse up
        // For this prototype, let's log on mouse up or just periodically. 
        // To avoid spam, we'll log only when the user stops dragging (onMouseUp)
    };

    const handleMouseUp = () => {
        logEvent("SIMULATION_CHANGE", { mass, force, acceleration });
    };

    return (
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg mb-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Interactive Lab: F = ma
            </h3>

            <div className="flex gap-8 items-center mb-8">
                <div className="flex-1 space-y-6">
                    <div>
                        <label className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                            Net Force (F)
                            <span className="text-white">{force} N</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={force}
                            onChange={(e) => handleChange('force', Number(e.target.value))}
                            onMouseUp={handleMouseUp}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div>
                        <label className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                            Mass (m)
                            <span className="text-white">{mass} kg</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={mass}
                            onChange={(e) => handleChange('mass', Number(e.target.value))}
                            onMouseUp={handleMouseUp}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                </div>

                <div className="w-32 h-32 bg-slate-800 rounded-full flex flex-col items-center justify-center border-4 border-slate-700 shadow-inner">
                    <div className="text-3xl font-bold text-white">{acceleration}</div>
                    <div className="text-xs text-slate-400">m/s²</div>
                    <div className="text-xs text-slate-500 mt-1">Acceleration</div>
                </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg text-sm text-slate-300 border border-slate-700">
                <p>Notice how increasing Force increases Acceleration, while increasing Mass decreases it.</p>
            </div>
        </div>
    );
};
