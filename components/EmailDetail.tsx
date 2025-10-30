
import React from 'react';
import { EmailContent } from '../types';
import { MailIcon, RefreshIcon } from './icons';

interface EmailDetailProps {
  emailContent: EmailContent | null;
  isLoading: boolean;
  onClose: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ emailContent, isLoading, onClose }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
                <RefreshIcon className="w-12 h-12 animate-spin text-teal-500 mb-4" />
                <p>Loading email...</p>
            </div>
        );
    }
    
    if (!emailContent) {
        return (
            <div className="hidden md:flex flex-col items-center justify-center h-full p-4 text-gray-500">
                <MailIcon className="w-24 h-24 mb-4" />
                <h3 className="text-xl font-semibold">Select an email to read</h3>
                <p className="text-sm">Your messages will appear here.</p>
            </div>
        );
    }

  return (
    <div className="bg-gray-800/50 p-4 md:p-6 h-full flex flex-col">
        <div className="flex-shrink-0 border-b border-gray-700 pb-4 mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-100">{emailContent.subject}</h2>
                    <p className="text-sm text-teal-400 mt-1">From: <span className="text-gray-300">{emailContent.from}</span></p>
                </div>
                 <button onClick={onClose} className="md:hidden p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="sr-only">Back to inbox</span>
                </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">{new Date(emailContent.date).toLocaleString()}</p>
        </div>
        <div className="overflow-y-auto flex-grow">
            <div
                className="prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: emailContent.body }}
            ></div>
        </div>
    </div>
  );
};

export default EmailDetail;
