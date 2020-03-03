export interface IMailTransport {
  init(apiKey: string): void;
  send(message: any): Promise<boolean>;
  sendMany?(message: any): Promise<boolean>;
}

export interface IMailOptions {
  to: string[];
  from: string;
  subject: string;
  text: string;
  engine: 'pug' | 'ejs';
  template: string;
  templateData: {};
  html: string;
  attachments?: string[];
}
