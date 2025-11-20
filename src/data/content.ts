import type { Unit, Concept, Exercise } from './types';

export const concepts: Record<string, Concept> = {
    'c1': {
        id: 'c1',
        title: "Newton's Second Law",
        description: "The relationship between force, mass, and acceleration.",
        content: `
# Newton's Second Law of Motion

Newton's second law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.

$$ \\vec{F}_{net} = m\\vec{a} $$

### Key Points
- **Force** is a vector quantity.
- **Mass** is a scalar quantity representing inertia.
- **Acceleration** is in the same direction as the net force.

### Worked Example
A 10 kg box is pushed with a net force of 50 N. What is its acceleration?

**Solution:**
$$ a = \\frac{F}{m} = \\frac{50 \\text{ N}}{10 \\text{ kg}} = 5 \\text{ m/s}^2 $$
    `,
        tags: ['NewtonsSecondLaw', 'Forces', 'Dynamics'],
        difficulty: 'easy',
        prerequisiteIds: []
    },
    'c2': {
        id: 'c2',
        title: "Friction",
        description: "Resistive forces opposing motion.",
        content: `
# Friction

Friction is a force that opposes the relative motion of two surfaces in contact.

### Types of Friction
1. **Static Friction ($f_s$):** Prevents motion from starting. $f_s \\le \\mu_s N$
2. **Kinetic Friction ($f_k$):** Acts when objects are sliding. $f_k = \\mu_k N$

Where $\\mu$ is the coefficient of friction and $N$ is the normal force.
    `,
        tags: ['Friction', 'Forces'],
        difficulty: 'medium',
        prerequisiteIds: ['c1']
    },
    'c3': {
        id: 'c3',
        title: "Uniform Circular Motion",
        description: "Motion in a circle at constant speed.",
        content: `
# Uniform Circular Motion

When an object moves in a circle at a constant speed, it experiences a **centripetal acceleration** directed toward the center of the circle.

$$ a_c = \\frac{v^2}{r} $$

According to Newton's Second Law, a net force must cause this acceleration:

$$ F_{net} = ma_c = \\frac{mv^2}{r} $$
    `,
        tags: ['CircularMotion', 'Acceleration'],
        difficulty: 'hard',
        prerequisiteIds: ['c1']
    },
    'c4': {
        id: 'c4',
        title: 'Work Done by a Constant Force',
        description: 'Work is the product of force and displacement.',
        content: `
# Work Done by a Constant Force

In physics, **Work** ($W$) is done when a force acts on an object and the object moves through a distance.

$$ W = F d \\cos \\theta $$

Where:
*   $F$ is the magnitude of the constant force.
*   $d$ is the magnitude of the displacement.
*   $\\theta$ is the angle between the force vector and the displacement vector.

**Key Points:**
*   Work is a **scalar** quantity, not a vector.
*   The SI unit of work is the **Joule (J)**, where $1 \\text{ J} = 1 \\text{ N} \\cdot \\text{ m}$.
*   Work can be positive, negative, or zero depending on the angle $\\theta$.
    `,
        tags: ['work', 'energy', 'scalar'],
        difficulty: 'easy',
        prerequisiteIds: ['c1']
    },
    'c5': {
        id: 'c5',
        title: 'Kinetic Energy & Work-Energy Theorem',
        description: 'The energy of motion and how net work changes it.',
        content: `
# Kinetic Energy

**Kinetic Energy** ($K$) is the energy associated with the motion of an object.

$$ K = \\frac{1}{2} m v^2 $$

# The Work-Energy Theorem

The **Work-Energy Theorem** states that the net work done on an object is equal to the change in its kinetic energy.

$$ W_{net} = \\Delta K = K_f - K_i $$

This is a powerful tool for solving problems where time is not explicitly involved.
    `,
        tags: ['energy', 'motion', 'theorem'],
        difficulty: 'medium',
        prerequisiteIds: ['c4']
    },
    'c6': {
        id: 'c6',
        title: 'Linear Momentum',
        description: 'Momentum is the product of mass and velocity.',
        content: `
# Linear Momentum

**Linear Momentum** ($\\vec{p}$) is defined as the product of an object's mass and its velocity.

$$ \\vec{p} = m \\vec{v} $$

**Key Points:**
*   Momentum is a **vector** quantity.
*   It points in the same direction as the velocity vector.
*   Newton's Second Law can be rewritten in terms of momentum: $\\vec{F}_{net} = \\frac{d\\vec{p}}{dt}$.
    `,
        tags: ['momentum', 'vector', 'newton'],
        difficulty: 'easy',
        prerequisiteIds: ['c1']
    },
    'c7': {
        id: 'c7',
        title: 'Impulse and Conservation',
        description: 'Change in momentum and the principle of conservation.',
        content: `
# Impulse

**Impulse** ($\\vec{J}$) is the product of the average force and the time interval during which it acts.

$$ \\vec{J} = \\vec{F}_{avg} \\Delta t = \\Delta \\vec{p} $$

# Conservation of Momentum

If the net external force on a system is zero, the total linear momentum of the system remains constant (conserved).

$$ \\vec{p}_{initial} = \\vec{p}_{final} $$

This is crucial for analyzing collisions and explosions.
    `,
        tags: ['impulse', 'conservation', 'collisions'],
        difficulty: 'medium',
        prerequisiteIds: ['c6']
    }
};

export const exercises: Record<string, Exercise[]> = {
    'c1': [
        {
            id: 'e1-1',
            conceptId: 'c1',
            type: 'multiple-choice',
            prompt: "If the net force on an object is doubled while its mass remains constant, what happens to its acceleration?",
            choices: ["It remains the same", "It doubles", "It is halved", "It quadruples"],
            correctAnswer: "It doubles",
            explanation: "Since a = F/m, doubling F (with constant m) doubles a.",
            difficulty: 'easy',
            hints: [
                "Look at the equation F = ma.",
                "Rearrange it to solve for acceleration: a = F/m.",
                "If F becomes 2F, what happens to a?"
            ],
            distractorFeedback: {
                "It remains the same": "Force and acceleration are directly related, so changing force must change acceleration.",
                "It is halved": "Think about the relationship. Pushing harder makes it go faster, not slower.",
                "It quadruples": "The relationship is linear, not quadratic."
            }
        },
        {
            id: 'e1-2',
            conceptId: 'c1',
            type: 'multiple-choice',
            prompt: "A 5 kg object accelerates at 2 m/s². What is the net force acting on it?",
            choices: ["2.5 N", "5 N", "10 N", "20 N"],
            correctAnswer: "10 N",
            explanation: "F = ma = 5 kg * 2 m/s² = 10 N.",
            difficulty: 'medium',
            hints: [
                "Identify the given values: mass (m) and acceleration (a).",
                "Use Newton's Second Law: F = ma."
            ],
            distractorFeedback: {
                "2.5 N": "You divided mass by acceleration. Remember F = ma.",
                "5 N": "That's just the mass. You need to multiply by acceleration.",
                "20 N": "Check your multiplication."
            }
        },
        {
            id: 'e1-3',
            conceptId: 'c1',
            type: 'multiple-choice',
            prompt: "If a constant non-zero net force is applied to an object, what can you say about its velocity?",
            choices: ["It is constant", "It is zero", "It changes at a constant rate", "It changes at an increasing rate"],
            correctAnswer: "It changes at a constant rate",
            explanation: "Constant force means constant acceleration (F=ma). Constant acceleration means velocity changes at a constant rate.",
            difficulty: 'medium'
        },
        {
            id: 'e1-4',
            conceptId: 'c1',
            type: 'multiple-choice',
            prompt: "An object has a mass of 10 kg on Earth. What is its mass on the Moon where gravity is 1/6th of Earth's?",
            choices: ["1.67 kg", "10 kg", "60 kg", "0 kg"],
            correctAnswer: "10 kg",
            explanation: "Mass is a measure of inertia and does not change with location. Weight changes, but mass remains constant.",
            difficulty: 'easy'
        },
        {
            id: 'e1-5',
            conceptId: 'c1',
            type: 'multiple-choice',
            prompt: "Which of the following is the correct unit for Force?",
            choices: ["kg·m/s", "kg·m/s²", "kg²/m", "m/s²"],
            correctAnswer: "kg·m/s²",
            explanation: "From F=ma, the units are mass (kg) times acceleration (m/s²), which is a Newton (N).",
            difficulty: 'easy'
        }
    ],
    'c2': [
        {
            id: 'e2-1',
            conceptId: 'c2',
            type: 'multiple-choice',
            prompt: "Which coefficient is typically larger?",
            choices: ["Coefficient of static friction", "Coefficient of kinetic friction", "They are always equal", "It depends on the velocity"],
            correctAnswer: "Coefficient of static friction",
            explanation: "It usually takes more force to start an object moving (static) than to keep it moving (kinetic).",
            difficulty: 'easy'
        }
    ],
    'c3': [
        {
            id: 'e3-1',
            conceptId: 'c3',
            type: 'multiple-choice',
            prompt: "In uniform circular motion, the net force is always directed:",
            choices: ["Tangent to the circle", "Away from the center", "Towards the center", "In the direction of motion"],
            correctAnswer: "Towards the center",
            explanation: "Centripetal force acts towards the center of rotation to change the velocity vector's direction.",
            difficulty: 'medium'
        }
    ],
    'c4': [
        {
            id: 'e4-1',
            conceptId: 'c4',
            type: 'multiple-choice',
            prompt: "A force of 10 N acts on a box moving 5 m in the direction of the force. How much work is done?",
            choices: ["2 J", "5 J", "15 J", "50 J"],
            correctAnswer: "50 J",
            explanation: "W = F * d * cos(0) = 10 * 5 * 1 = 50 J.",
            difficulty: 'easy'
        }
    ],
    'c5': [
        {
            id: 'e5-1',
            conceptId: 'c5',
            type: 'multiple-choice',
            prompt: "If the speed of a car doubles, its kinetic energy increases by a factor of:",
            choices: ["2", "4", "8", "16"],
            correctAnswer: "4",
            explanation: "K = 1/2 m v^2. Since K is proportional to v^2, doubling v leads to 2^2 = 4 times the energy.",
            difficulty: 'medium'
        }
    ],
    'c6': [
        {
            id: 'e6-1',
            conceptId: 'c6',
            type: 'multiple-choice',
            prompt: "Which has more momentum: a 1000 kg car at 20 m/s or a 2000 kg truck at 10 m/s?",
            choices: ["The car", "The truck", "They are equal", "Cannot be determined"],
            correctAnswer: "They are equal",
            explanation: "p = mv. Car: 1000 * 20 = 20000. Truck: 2000 * 10 = 20000.",
            difficulty: 'easy'
        }
    ],
    'c7': []
};

export const units: Unit[] = [
    {
        id: 'u1',
        title: 'Dynamics',
        subunits: [
            {
                id: 's1',
                title: 'Newton\'s Laws',
                conceptIds: ['c1']
            },
            {
                id: 's2',
                title: 'Forces and Applications',
                conceptIds: ['c2', 'c3']
            }
        ]
    },
    {
        id: 'u2',
        title: 'Work and Energy',
        subunits: [
            {
                id: 's3',
                title: 'Work & Kinetic Energy',
                conceptIds: ['c4', 'c5']
            }
        ]
    },
    {
        id: 'u3',
        title: 'Impulse and Momentum',
        subunits: [
            {
                id: 's4',
                title: 'Conservation Laws',
                conceptIds: ['c6', 'c7']
            }
        ]
    }
];
