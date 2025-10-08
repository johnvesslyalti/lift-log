// app/settings/page.tsx
"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { useState } from "react";

export default function SettingsPage() {
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

  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);

  const saveProfile = () => {
    setName(tempName);
    setEmail(tempEmail);
    alert("Profile saved!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Account */}
      <section className="shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold">Account</h2>
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
        <button
          onClick={saveProfile}
          className="bg-text-white px-4 py-2 rounded"
        >
          Save Profile
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
          className="border rounded p-2"
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
    </div>
  );
}
