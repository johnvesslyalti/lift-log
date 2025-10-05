'use client'

import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import ExerciseModal from "./exercise-model";

export default function Exercise() {
    return (
        <div>
            <div className="flex justify-between items-center p-5">
                <div className="text-xl font-bold">Exercises</div>
                <ExerciseModal />
            </div>
        </div>
    )
}