'use client';

import { useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useUserStore } from "@/store/userStore";
import HandleDeleteAccount from "@/components/handle-delete-account";
import Alert from "@/components/Alert";

export default function SettingsPage() {
  // Settings Store
  const {
    darkMode,
    emailNotifications,
    pushNotifications,
    showProfile,
    name,
    email,
    language,
    setDarkMode,
    setEmailNotifications,
    setPushNotifications,
    setShowProfile,
    setName,
    setEmail,
    setLanguage,
  } = useSettingsStore();

  // User Store for height & weight
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // Temp states for profile
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [height, setHeight] = useState<number | null>(user?.height ?? null);
  const [weight, setWeight] = useState<number | null>(user?.weight ?? null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState<{ text: string; type?: "success" | "error" | "info" } | null>(null);

  // Save Profile
  const handleSaveProfile = async () => {
    setError("");
    setAlert(null); // clear previous alert

    if (!height || height <= 0 || !weight || weight <= 0) {
      setError("Please enter valid height and weight.");
      return;
    }

    if (!user) {
      setError("User not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ height, weight }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      // Update stores
      setUser({ ...user, height, weight });
      setName(tempName);
      setEmail(tempEmail);

      // Show success alert
      setAlert({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Settings</h1>

      {/* Alert */}
      {alert && <Alert text={alert.text} type={alert.type} />}

      {/* Account / Profile */}
      <section className="shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>

        <div className="space-y-2">
          <label className="block">Name</label>
          <input
            className="border rounded p-2 w-full"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block">Email</label>
          <input
            className="border rounded p-2 w-full"
            value={tempEmail}
            onChange={(e) => setTempEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block">Height (cm)</label>
          <input
            type="number"
            className="border rounded p-2 w-full"
            value={height ?? ""}
            onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : null)}
          />
        </div>

        <div className="space-y-2">
          <label className="block">Weight (kg)</label>
          <input
            type="number"
            className="border rounded p-2 w-full"
            value={weight ?? ""}
            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : null)}
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleSaveProfile}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </section>

      {/* Security & Privacy */}
      <section className="shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold">Security & Privacy</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showProfile}
            onChange={(e) => setShowProfile(e.target.checked)}
          />
          <span>Show Profile to Others</span>
        </label>
      </section>

      {/* Notifications */}
      <section className="shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />
          <span>Email Notifications</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={(e) => setPushNotifications(e.target.checked)}
          />
          <span>Push Notifications</span>
        </label>
      </section>

      {/* Appearance */}
      <section className="shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold">Appearance</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          <span>Dark Mode</span>
        </label>
      </section>

      {/* Language & Region */}
      <section className="shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold">Language & Region</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
        </select>
      </section>

      {/* About */}
      <section className="shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold">About</h2>
        <p>App Version: 1.0.0</p>
      </section>

      {/* Delete Account */}
      <div className="w-full flex justify-center">
        <HandleDeleteAccount />
      </div>
    </div>
  );
}
