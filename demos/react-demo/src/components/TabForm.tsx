import { type ReactNode, useState, type JSX } from "react";

interface TabFormProps {
  passwordTabContent: ReactNode;
  magicTabContent: ReactNode;
  socialTabContent?: ReactNode;
}

export default function TabForm({
  passwordTabContent,
  magicTabContent,
  socialTabContent,
}: TabFormProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<"password" | "magic" | "social">(
    "password",
  );

  return (
    <div>
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "password" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Email + Password
        </button>
        <button
          className={`tab-button ${activeTab === "magic" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("magic")}
        >
          Magic Link
        </button>
        {socialTabContent && (
          <button
            className={`tab-button ${activeTab === "social" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("social")}
          >
            Social
          </button>
        )}
      </div>

      <div className="tab-content">
        {activeTab === "password"
          ? passwordTabContent
          : activeTab === "magic"
            ? magicTabContent
            : socialTabContent}
      </div>
    </div>
  );
}
