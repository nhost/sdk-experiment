"use client";

import { useState, type ReactNode } from "react";

interface TabFormProps {
  passwordTabLabel?: string;
  magicTabLabel?: string;
  socialTabLabel?: string;
  passwordTabContent: ReactNode;
  magicTabContent: ReactNode;
  socialTabContent?: ReactNode;
}

export default function TabForm({
  passwordTabLabel = "Email & Password",
  magicTabLabel = "Magic Link",
  socialTabLabel = "Social",
  passwordTabContent,
  magicTabContent,
  socialTabContent,
}: TabFormProps) {
  const [activeTab, setActiveTab] = useState<"password" | "magic" | "social">(
    "password",
  );

  return (
    <div>
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "password" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("password")}
          type="button"
        >
          {passwordTabLabel}
        </button>
        <button
          className={`tab-button ${activeTab === "magic" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("magic")}
          type="button"
        >
          {magicTabLabel}
        </button>
        {socialTabContent && (
          <button
            className={`tab-button ${activeTab === "social" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("social")}
            type="button"
          >
            {socialTabLabel}
          </button>
        )}
      </div>

      <div className="tab-content">
        {activeTab === "password" && passwordTabContent}
        {activeTab === "magic" && magicTabContent}
        {activeTab === "social" && socialTabContent}
      </div>
    </div>
  );
}
