import React from 'react';
import { EmailPreview } from '../types';
// FIX: Import RefreshIcon to resolve 'Cannot find name' error.
import { InboxIcon, RefreshIcon } from './icons';

interface InboxListProps {
  emails: EmailPreview[];
  onSelectEmail: (id: number) => void;
  selectedEmailId: number | null;
  isLoading: boolean;
}

const InboxListItem: React.FC<{email: EmailPreview, isSelected: boolean, onSelect: () => void}> = ({email, isSelected, onSelect}) => (
    <li
        onClick={onSelect}
        className={`p-4 border-l-4 cursor-pointer transition-colors duration-200 ${
        isSelected
            ? 'bg-gray-700/50 border-teal-500'
            : 'bg-gray-800/30 border-gray-700 hover:bg-gray-700/40 hover:border-teal-600'
        }`}
    >
        <div className="flex justify-between items-start">
            <p className="font-semibold text-teal-300 truncate pr-2">{email.from}</p>
            <p className="text-xs text-gray-400 flex-shrink-0">{new Date(email.date).toLocaleString()}</p>
        </div>
        <p className="text-sm text-gray-300 mt-1 truncate">{email.subject}</p>
    </li>
);

const InboxList: React.FC<InboxListProps> = ({ emails, onSelectEmail, selectedEmailId, isLoading }) => {
  if (isLoading && emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
        <RefreshIcon className="w-12 h-12 animate-spin text-teal-500 mb-4" />
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
    <ul className="space-y-1 overflow-y-auto">
      {emails.map((email) => (
        <InboxListItem
          key={email.id}
          email={email}
          isSelected={email.id === selectedEmailId}
          onSelect={() => onSelectEmail(email.id)}
        />
      ))}
    </ul>
  );
};

export default InboxList;
