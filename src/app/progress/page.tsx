"use client";

import { useState, useEffect } from "react";

type Progress = {
  date: string;
  weight: number;
  streak: number;
};

export default function Page() {
  const [progressData, setProgressData] = useState<Progress[]>([]);

  // Simulate fetching dummy data
  useEffect(() => {
    const dummyData: Progress[] = [
      { date: "2025-10-02", weight: 72.0, streak: 1 },
      { date: "2025-10-03", weight: 72.2, streak: 2 },
      { date: "2025-10-04", weight: 72.4, streak: 3 },
      { date: "2025-10-05", weight: 72.3, streak: 4 },
      { date: "2025-10-06", weight: 72.5, streak: 5 },
    ];
    setProgressData(dummyData);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Progress Log</h1>
      <ul className="space-y-2">
        {progressData.map((entry, index) => (
          <li
            key={index}
            className="p-3 border rounded shadow-sm flex justify-between"
          >
            <span>{entry.date}</span>
            <span>Weight: {entry.weight} kg</span>
            <span>Streak: {entry.streak} days</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
