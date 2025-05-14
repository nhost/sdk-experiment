import { useState } from 'react';

export default function TabForm({ passwordTabContent, magicTabContent }) {
  const [activeTab, setActiveTab] = useState('password');

  return (
    <div>
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'password' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Email + Password
        </button>
        <button
          className={`tab-button ${activeTab === 'magic' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('magic')}
        >
          Magic Link
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'password' ? passwordTabContent : magicTabContent}
      </div>
    </div>
  );
}