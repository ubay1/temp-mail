export interface EmailPreview {
  id: number;
  from: string;
  subject: string;
  date: string;
  hasAttachment: boolean;
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
  downloadUrl: string;
}

export interface EmailContent {
  id: number;
  from: string;
  subject: string;
  date: string;
  attachments: EmailAttachment[];
  body: string;
  textBody: string;
  htmlBody: string;
}
