import React from 'react';
import { EmailPreview } from '../types';
import { InboxIcon, SpinnerIcon, TrashIcon, PaperclipIcon } from './icons';

interface InboxListProps {
  emails: EmailPreview[];
  onSelectEmail: (id: number) => void;
  selectedEmailId: number | null;
  isLoading: boolean;
  onDeleteEmail: (id: number) => void;
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'Invalid Date';

    const compliantDateString = dateString.replace(' ', 'T');
    const date = new Date(compliantDateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString();
};

const InboxListItem: React.FC<{email: EmailPreview, isSelected: boolean, onSelect: () => void, onDelete: () => void}> = ({email, isSelected, onSelect, onDelete}) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <li
            onClick={onSelect}
            className={`p-4 border-l-4 cursor-pointer transition-colors duration-200 flex items-center justify-between group ${
            isSelected
                ? 'bg-gray-700/50 border-teal-500'
                : 'bg-gray-800/30 border-gray-700 hover:bg-gray-700/40 hover:border-teal-600'
            }`}
        >
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-start">
                    <p className="font-semibold text-teal-300 truncate pr-2">{email.from}</p>
                    <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(email.date)}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    {email.hasAttachment && <PaperclipIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                    <p className="text-sm text-gray-300 truncate">{email.subject}</p>
                </div>
            </div>
            <button 
                onClick={handleDelete}
                className="ml-2 p-1 rounded-full text-gray-500 hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                aria-label="Delete email"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </li>
    );
}

const InboxList: React.FC<InboxListProps> = ({ emails, onSelectEmail, selectedEmailId, isLoading, onDeleteEmail }) => {
  if (isLoading && emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
        <SpinnerIcon className="w-12 h-12 animate-spin text-teal-500 mb-4" />
        <p>Checking for new mail...</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
        <InboxIcon className="w-16 h-16 mb-4" />
        <h3 className="text-lg font-semibold">Inbox is Empty</h3>
        <p className="text-sm text-center">Waiting for incoming emails.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
          <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm flex items-center justify-center z-10">
              <SpinnerIcon className="w-10 h-10 animate-spin text-teal-400" />
          </div>
      )}
      <ul className="space-y-1 overflow-y-auto">
        {emails.map((email) => (
          <InboxListItem
            key={email.id}
            email={email}
            isSelected={email.id === selectedEmailId}
            onSelect={() => onSelectEmail(email.id)}
            onDelete={() => onDeleteEmail(email.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default InboxList;