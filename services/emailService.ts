import { EmailPreview, EmailContent, EmailAttachment } from '../types';

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
    hasAttachment: !!email.att,
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

  let attachments: EmailAttachment[] = [];
  // Handle case where API returns a single object for one attachment or an array for multiple.
  if (data.att) {
      const attachmentArray = Array.isArray(data.att) ? data.att : [data.att];
      attachments = attachmentArray.map((attachment: any, index: number) => {
          // Guerrilla Mail part IDs for attachments seem to start at 2
          const partId = index + 2;
          const downloadUrl = `${API_BASE_URL}?f=get_attachment&sid_token=${sid_token}&email_id=${id}&part_id=${partId}`;
          return {
              filename: attachment.name || `attachment-${index + 1}`, // Default filename
              contentType: attachment.type || 'application/octet-stream', // Default content type
              size: parseInt(attachment.size, 10) || 0, // Default size if parsing fails
              downloadUrl: downloadUrl,
          };
      });
  }

  // Map the response to our EmailContent type
  return {
    id: parseInt(data.mail_id, 10),
    from: data.mail_from,
    subject: data.mail_subject,
    date: data.mail_date,
    attachments: attachments,
    body: data.mail_body,
    textBody: '', // It also doesn't provide a separate text body
    htmlBody: data.mail_body,
  };
};

export const deleteEmail = async (sid_token: string, emailIds: number[]): Promise<void> => {
  if (!sid_token) {
    throw new Error('Session token is missing for deletion.');
  }
  const params = new URLSearchParams();
  params.append('f', 'del_email');
  params.append('sid_token', sid_token);
  emailIds.forEach(id => params.append('email_ids[]', id.toString()));

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: 'POST' // Using POST though GET might work
  });

  if (!response.ok) {
    throw new Error('Failed to delete email from server.');
  }
  
  const result = await response.json();
  // You might want to check the result for success confirmation
};