import { ReactNode, useState, JSX } from "react";

interface TabFormProps {
  passwordTabContent: ReactNode;
  magicTabContent: ReactNode;
}

export default function TabForm({
  passwordTabContent,
  magicTabContent,
}: TabFormProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<"password" | "magic">("password");

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
      </div>

      <div className="tab-content">
        {activeTab === "password" ? passwordTabContent : magicTabContent}
      </div>
    </div>
  );
}
