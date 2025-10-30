import React from 'react';
import { EmailContent } from '../types';
import { MailIcon, SpinnerIcon, TrashIcon, DocumentIcon } from './icons';

interface EmailDetailProps {
  emailContent: EmailContent | null;
  isLoading: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  isRefreshing: boolean;
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'Invalid Date';
    const compliantDateString = dateString.replace(' ', 'T');
    const date = new Date(compliantDateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString();
};

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const Attachments: React.FC<{ attachments: EmailContent['attachments'] }> = ({ attachments }) => {
    const handleDownload = (url: string, filename: string) => {
        // This approach avoids fetch/CORS issues and lets the browser handle the download.
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        // For cross-origin, 'download' may not work without server headers.
        // 'target="_blank"' is a good fallback to open the file in a new tab.
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!attachments || attachments.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 pt-4 border-t border-gray-700">
            <h3 className="text-md font-semibold text-gray-300 mb-2">Attachments ({attachments.length})</h3>
            <ul className="space-y-2">
                {attachments.map((att, index) => (
                    <li key={index} className="bg-gray-700/50 p-2 rounded-md flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <DocumentIcon className="w-6 h-6 text-teal-400 flex-shrink-0" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-200 truncate">{att.filename}</p>
                                <p className="text-xs text-gray-400">{formatBytes(att.size)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDownload(att.downloadUrl, att.filename)}
                            className="ml-4 flex-shrink-0 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-md transition-colors"
                        >
                            Download
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const EmailDetail: React.FC<EmailDetailProps> = ({ emailContent, isLoading, onClose, onDelete, isRefreshing }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
                <SpinnerIcon className="w-12 h-12 animate-spin text-teal-500 mb-4" />
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
    <div className="relative bg-gray-800/50 p-4 md:p-6 h-full flex flex-col">
        {isRefreshing && (
            <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm flex items-center justify-center z-20">
                <SpinnerIcon className="w-10 h-10 animate-spin text-teal-400" />
            </div>
        )}
        <div className="flex-shrink-0 border-b border-gray-700 pb-4 mb-4">
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <h2 className="text-xl font-bold text-gray-100">{emailContent.subject}</h2>
                    <p className="text-sm text-teal-400 mt-1">From: <span className="text-gray-300">{emailContent.from}</span></p>
                </div>
                 <div className="flex items-center flex-shrink-0 ml-4">
                    <button 
                        onClick={() => onDelete(emailContent.id)} 
                        className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                        aria-label="Delete Email"
                    >
                        <TrashIcon className="h-6 w-6" />
                    </button>
                    <button onClick={onClose} className="md:hidden p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="sr-only">Back to inbox</span>
                    </button>
                 </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{formatDate(emailContent.date)}</p>
        </div>
        <div className="overflow-y-auto flex-grow">
            <div
                className="prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: emailContent.body }}
            ></div>
            <Attachments attachments={emailContent.attachments} />
        </div>
    </div>
  );
};

export default EmailDetail;