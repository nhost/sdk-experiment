'use client';

import { useState, ReactNode } from 'react';

interface TabFormProps {
  passwordTabLabel?: string;
  magicTabLabel?: string;
  passwordTabContent: ReactNode;
  magicTabContent: ReactNode;
}

export default function TabForm({ 
  passwordTabLabel = 'Email & Password',
  magicTabLabel = 'Magic Link',
  passwordTabContent, 
  magicTabContent 
}: TabFormProps) {
  const [activeTab, setActiveTab] = useState<'password' | 'magic'>('password');

  return (
    <div>
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'password' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('password')}
          type="button"
        >
          {passwordTabLabel}
        </button>
        <button
          className={`tab-button ${activeTab === 'magic' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('magic')}
          type="button"
        >
          {magicTabLabel}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'password' && passwordTabContent}
        {activeTab === 'magic' && magicTabContent}
      </div>
    </div>
  );
} 