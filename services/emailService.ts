import { EmailPreview, EmailContent } from '../types';

const API_BASE_URL = 'https://api.guerrillamail.com/ajax.php';

// Guerrilla Mail uses a session token (sid_token)
interface GenerationResponse {
    email: string;
    sid_token: string;
}

export const generateRandomEmail = async (): Promise<GenerationResponse> => {
  // This call initializes a session and gives us an email address
  const response = await fetch(`${API_BASE_URL}?f=get_email_address`);
  if (!response.ok) {
    throw new Error('Failed to generate email address.');
  }
  const data = await response.json();
  if (!data.email_addr || !data.sid_token) {
    throw new Error('Invalid response from email generation API.');
  }
  return { email: data.email_addr, sid_token: data.sid_token };
};

export const fetchEmails = async (sid_token: string): Promise<EmailPreview[]> => {
  if (!sid_token) return [];
  // Use the session token to check for new emails
  const response = await fetch(`${API_BASE_URL}?f=check_email&seq=0&sid_token=${sid_token}`);
  if (!response.ok) {
    // It's better to not throw an error on polling, just log it.
    console.error('Failed to fetch emails.');
    return [];
  }
  const data = await response.json();
  // Map the response to our EmailPreview type
  return (data.list || []).map((email: any) => ({
    id: email.mail_id,
    from: email.mail_from,
    subject: email.mail_subject,
    date: email.mail_date,
  }));
};

export const readEmail = async (sid_token: string, id: number): Promise<EmailContent> => {
  if (!sid_token) {
      throw new Error('Session token is missing.');
  }
  // Use the session token and email ID to fetch the full content
  const response = await fetch(`${API_BASE_URL}?f=fetch_email&email_id=${id}&sid_token=${sid_token}`);
  if (!response.ok) {
    throw new Error('Failed to read email.');
  }
  const data = await response.json();
  // Map the response to our EmailContent type
  return {
    id: parseInt(data.mail_id, 10),
    from: data.mail_from,
    subject: data.mail_subject,
    date: data.mail_date,
    attachments: [], // Guerrilla Mail API doesn't provide attachments in this call
    body: data.mail_body,
    textBody: '', // It also doesn't provide a separate text body
    htmlBody: data.mail_body,
  };
};
