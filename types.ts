
export interface EmailPreview {
  id: number;
  from: string;
  subject: string;
  date: string;
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
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
