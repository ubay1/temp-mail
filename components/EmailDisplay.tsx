import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface EmailDisplayProps {
  email: string | null;
  onNewEmail: () => void;
  onRefresh: () => void;
  isGenerating: boolean;
}

const EmailDisplay: React.FC<EmailDisplayProps> = ({ email, onNewEmail, onRefresh, isGenerating }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  useEffect(() => {
    // Reset copied state when email changes
    setCopied(false);
  }, [email]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-700">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-grow w-full">
            <label htmlFor="temp-email" className="text-sm font-medium text-teal-400 mb-1 block">Your Temporary Email</label>
            <div className="relative">
                <input
                id="temp-email"
                type="text"
                readOnly
                value={email || 'Generating...'}
                className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 pl-3 pr-10 text-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                />
                <button
                    onClick={handleCopy}
                    disabled={!email}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white disabled:text-gray-600 transition-colors"
                >
                {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </button>
            </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={onRefresh}
            disabled={!email}
            className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-all"
          >
            Refresh
          </button>
          <button
            onClick={onNewEmail}
            disabled={isGenerating}
            className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-wait text-white font-semibold rounded-md transition-all"
          >
            Change Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDisplay;