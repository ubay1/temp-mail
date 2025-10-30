import React, { useState, useEffect, useCallback } from 'react';
import EmailDisplay from './components/EmailDisplay';
import InboxList from './components/InboxList';
import EmailDetail from './components/EmailDetail';
import { generateRandomEmail, fetchEmails, readEmail } from './services/emailService';
import { EmailPreview, EmailContent } from './types';
import { MailIcon } from './components/icons';

const App: React.FC = () => {
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [sidToken, setSidToken] = useState<string | null>(null); // State for session token
  const [emails, setEmails] = useState<EmailPreview[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);
  const [emailContent, setEmailContent] = useState<EmailContent | null>(null);

  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [isInboxLoading, setIsInboxLoading] = useState<boolean>(false);
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerateNewEmail = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setEmails([]);
    setSelectedEmailId(null);
    setEmailContent(null);
    setCurrentEmail(null);
    setSidToken(null);
    try {
      const { email, sid_token } = await generateRandomEmail();
      setCurrentEmail(email);
      setSidToken(sid_token);
    } catch (e) {
      setError('Failed to generate a new email address. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleFetchEmails = useCallback(async () => {
    if (!sidToken) return;
    setIsInboxLoading(true);
    try {
      const fetchedEmails = await fetchEmails(sidToken);
      // Prevent re-selecting email if the list is just refreshed
      setEmails(prevEmails => {
          if (JSON.stringify(prevEmails) !== JSON.stringify(fetchedEmails)) {
              return fetchedEmails;
          }
          return prevEmails;
      });
    } catch (e) {
       // Silently fail on refresh, don't show error for polling
       console.error('Failed to fetch emails');
    } finally {
        setIsInboxLoading(false);
    }
  }, [sidToken]);

  useEffect(() => {
    handleGenerateNewEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sidToken) {
      handleFetchEmails(); // Fetch immediately
      const interval = setInterval(handleFetchEmails, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [sidToken, handleFetchEmails]);

  useEffect(() => {
    const fetchEmailContent = async () => {
      if (selectedEmailId && sidToken) {
        setIsEmailLoading(true);
        setEmailContent(null);
        try {
          const content = await readEmail(sidToken, selectedEmailId);
          setEmailContent(content);
        } catch (e) {
          setError('Could not load email content.');
        } finally {
          setIsEmailLoading(false);
        }
      }
    };
    fetchEmailContent();
  }, [selectedEmailId, sidToken]);
  
  const handleSelectEmail = (id: number) => {
    setSelectedEmailId(id);
  };
  
  const handleCloseDetail = () => {
    setSelectedEmailId(null);
    setEmailContent(null);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
        <header className="p-4 bg-gray-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-800">
             <div className="max-w-7xl mx-auto flex items-center gap-3">
                <MailIcon className="w-8 h-8 text-teal-400" />
                <h1 className="text-2xl font-bold tracking-tight text-white">Temp Mail Inbox</h1>
            </div>
        </header>
        <main className="flex-grow p-4 max-w-7xl mx-auto w-full">
            <EmailDisplay 
                email={currentEmail} 
                onNewEmail={handleGenerateNewEmail}
                onRefresh={handleFetchEmails}
                isGenerating={isGenerating}
            />
            {error && <div className="mt-4 p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-md">{error}</div>}
            
            <div className="mt-4 flex-grow h-[calc(100vh-180px)] border border-gray-700/50 rounded-lg shadow-xl overflow-hidden bg-gray-800/20 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {/* Mobile View */}
                <div className="md:hidden">
                    {!selectedEmailId ? (
                        <div className="h-full flex flex-col">
                            <h2 className="p-4 text-lg font-semibold border-b border-gray-700 flex-shrink-0">Inbox</h2>
                            <div className="overflow-y-auto flex-grow">
                                <InboxList emails={emails} onSelectEmail={handleSelectEmail} selectedEmailId={selectedEmailId} isLoading={isInboxLoading} />
                            </div>
                        </div>
                    ) : (
                        <EmailDetail emailContent={emailContent} isLoading={isEmailLoading} onClose={handleCloseDetail} />
                    )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:flex md:flex-col col-span-1 lg:col-span-1 border-r border-gray-700">
                    <h2 className="p-4 text-lg font-semibold border-b border-gray-700 flex-shrink-0">Inbox ({emails.length})</h2>
                    <div className="overflow-y-auto flex-grow">
                         <InboxList emails={emails} onSelectEmail={handleSelectEmail} selectedEmailId={selectedEmailId} isLoading={isInboxLoading} />
                    </div>
                </div>
                <div className="hidden md:block col-span-2 lg:col-span-3">
                     <EmailDetail emailContent={emailContent} isLoading={isEmailLoading} onClose={handleCloseDetail}/>
                </div>
            </div>
        </main>
    </div>
  );
};

export default App;
