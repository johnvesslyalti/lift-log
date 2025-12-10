// src/components/ProfileForm.tsx
"use client";

// Import Resolver for the type assertion workaround
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

// Import the input type for useForm and the output type for onSubmit
import {
    ProfileFormValues, // Output type (number | null | undefined)
    profileSchema,
    ProfileFormInput // Input type (string | null | undefined)
} from "@/lib/validation";
import { useUserStore } from "@/store/userStore";

/**
 * Interface for the data received from the GET endpoint, 
 * which includes number | null for height/weight.
 */
interface ProfileData {
    height: number | null;
    weight: number | null;
}

export function ProfileForm() {
    const setUser = useUserStore((state) => state.setUser);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileFormInput>({
        // ------------------------------------------------------------------
        // FIX 1: Type Assertion on zodResolver for the input type
        // This resolves the error in the useForm hook itself.
        resolver: zodResolver(profileSchema) as Resolver<ProfileFormInput>,
        // ------------------------------------------------------------------
        defaultValues: {
            height: "",
            weight: "",
        },
    });

    // 1. Fetch current profile data (GET /api/profile)
    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch("/api/profile");
                if (!response.ok) throw new Error("Failed to fetch profile data.");

                const data: ProfileData = await response.json();

                reset({
                    height: data.height?.toString() ?? "",
                    weight: data.weight?.toString() ?? "",
                });

            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred while fetching data.");
            } finally {
                setIsDataLoading(false);
            }
        }
        fetchProfile();
    }, [reset]);


    // 2. Handle form submission (PUT /api/profile)
    // The handler is typed to accept the Zod output type (number-based)
    const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const body = JSON.stringify({
                height: data.height === null ? null : data.height,
                weight: data.weight === null ? null : data.weight,
            });

            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile.");
            }

            setUser(prev => ({
                ...prev!,
                height: data.height ?? undefined,
                weight: data.weight ?? undefined,
            }));

            alert("Profile updated successfully!");

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown update error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isDataLoading) {
        return <div className="text-center p-4">Loading profile data...</div>;
    }

    return (
        <form
            // ------------------------------------------------------------------
            // FIX 2: Type Assertion on the onSubmit function when passing it to handleSubmit
            // This resolves the error on line 116 by telling the compiler 
            // that the function we pass to handleSubmit actually accepts the 
            // string-based ProfileFormInput, even though its internal logic 
            // expects the number-based ProfileFormValues.
            onSubmit={handleSubmit(onSubmit as SubmitHandler<ProfileFormInput>)}
            // ------------------------------------------------------------------
            className="space-y-6 max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg"
        >
            <h2 className="text-2xl font-bold text-gray-800">Body Metrics</h2>

            {/* Height Field */}
            <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                    Height (cm)
                </label>
                <input
                    id="height"
                    type="number"
                    step="1"
                    placeholder="e.g., 175"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    {...register("height")}
                />
                {errors.height && <p className="mt-1 text-sm text-red-500">{errors.height.message}</p>}
            </div>

            {/* Weight Field */}
            <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                </label>
                <input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 75.5"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    {...register("weight")}
                />
                {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight.message}</p>}
            </div>

            {/* Submission Status and Button */}
            {error && <p className="text-sm text-red-500 border border-red-200 p-2 rounded bg-red-50">Error: {error}</p>}

            <button
                type="submit"
                disabled={isLoading || !isDirty}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          ${isLoading || !isDirty
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
            >
                {isLoading ? "Saving..." : "Save Profile"}
            </button>
        </form>
    );
}