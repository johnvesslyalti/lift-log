'use client'

import { useState, useEffect } from "react";
import ExerciseModal from "./exercise-model";
import { handleError } from "@/components/error-handle";

interface Exercise {
    id: number;
    name: string;
    sets: number;
    reps: number;
    category: string;
}

export default function Exercise() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchExercises = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch('/api/exercise');

            if (!res.ok) throw new Error(`Failed to fetch exercises (${res.status})`);

            const data = await res.json();
            console.log("Fetched data:", data);

            // Ensure we always have an array
            if (Array.isArray(data)) {
                setExercises(data);
            } else if (Array.isArray(data.exercises)) {
                setExercises(data.exercises);
            } else {
                setExercises([]); // fallback to empty array
            }
            setLoading(false)
        } catch(error: unknown) {
            const err = handleError(error)
        }
    }

    useEffect(() => {
        fetchExercises();
    }, []);

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold">Exercises</h2>
                <ExerciseModal onsuccess={fetchExercises}/>
            </div>

            {loading && <p>Loading exercises...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.isArray(exercises) && exercises.map(ex => (
                    <div key={ex.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
                        <h3 className="text-lg font-semibold">{ex.name}</h3>
                        <p>Category: {ex.category}</p>
                        <p>Sets: {ex.sets}</p>
                        <p>Reps: {ex.reps}</p>
                    </div>
                ))}
            </div>

            {Array.isArray(exercises) && exercises.length === 0 && !loading && !error && (
                <p className="text-gray-500">No exercises found. Add one using the button above!</p>
            )}
        </div>
    )
}
