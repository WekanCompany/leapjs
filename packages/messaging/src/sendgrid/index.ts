import { Logger } from '@leapjs/common';
import { setApiKey, send as sendOne } from '@sendgrid/mail';
import { MailData } from '@sendgrid/helpers/classes/mail';
import { readFileSync } from 'fs';
import { basename, resolve } from 'path';
import { lookup } from 'mime-types';
import { IMailTransport } from '../interfaces/mail';
import { INVALID_ATTACHMENTS } from '../resources/strings';

class Sendgrid implements IMailTransport {
  private logger = Logger.getInstance();

  public init(apiKey: string): void {
    setApiKey(apiKey as any);
  }

  public async send(message: any): Promise<boolean> {
    const mail: MailData = { from: '' };
    mail.from = message.from;
    mail.to = message.to;
    mail.subject = message.subject;
    mail.text = message.text || '';
    mail.html = message.html;

    try {
      if (message.attachments) {
        if (Array.isArray(message.attachments)) {
          const attachments: any = [];

          for (let i = 0; i < message.attachments.length; i += 1) {
            const filename = basename(message.attachments[i]);
            attachments[i] = {
              content: readFileSync(resolve(message.attachments[i])).toString(
                'base64',
              ),
              filename,
              type: lookup(filename),
              disposition: 'attachment',
            };
          }
          mail.attachments = attachments;
        } else {
          return Promise.reject(new Error(INVALID_ATTACHMENTS));
        }
      }
    } catch (error) {
      this.logger.error('Error attaching file(s)', error, 'Sendgrid');
      return false;
    }

    return sendOne(mail)
      .then(() => {
        this.logger.log(`Sent mail to ${mail.to} successfully`, 'Sendgrid');
        return true;
      })
      .catch((error) => {
        this.logger.error(
          'Error sending mail',
          error.response.body,
          'Sendgrid',
        );
        return false;
      });
  }
}

export default Sendgrid;
