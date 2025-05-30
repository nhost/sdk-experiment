import { type ReactNode, useState, type JSX } from "react";

interface TabFormProps {
  passwordTabContent: ReactNode;
}

export default function TabForm({
  passwordTabContent,
}: TabFormProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<
    "password" | "magic" | "social" | "webauthn"
  >("password");

  return (
    <div>
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "password" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Email + Password
        </button>
      </div>
      <div className="tab-content">{passwordTabContent}</div>
    </div>
  );
}
