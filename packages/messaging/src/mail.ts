import { Logger, injectable } from '@leapjs/common';
import { receiver, publisher } from '@leapjs/queue';
import { renderFile as ejsRenderFile } from 'ejs';
import { renderFile as pugRenderFile } from 'pug';
import { resolve } from 'path';
import { IMailTransport, IMailOptions } from './interfaces/mail';
import {
  ERROR_RENDERING_TEMPLATE,
  ENGINE_NOT_SUPPORTED,
  QUEUE_SEND_FAILED,
} from './resources/strings';

@injectable()
class Mail {
  private render = { ejs: ejsRenderFile, pug: pugRenderFile };
  private mailTransport!: IMailTransport;
  private apiKey: string;

  private async renderTemplate(
    engine: 'ejs' | 'pug',
    template: string,
    templateData: {},
  ): Promise<string> {
    if (engine) {
      // TODO Add handlebars support
      return Promise.resolve(this.render[engine](template, templateData)).catch(
        (error) => {
          Logger.error('Failed to render template', error, 'Mailer');
          return Promise.reject(new Error(ERROR_RENDERING_TEMPLATE));
        },
      );
    }
    return Promise.reject(new Error(ENGINE_NOT_SUPPORTED));
  }

  constructor(mailTransport: IMailTransport) {
    this.mailTransport = mailTransport;
  }

  public init(apiKey: string): void {
    this.apiKey = apiKey;
    this.mailTransport.init(this.apiKey);
  }

  public static async defaultMailHandler(args: any): Promise<void> {
    Logger.log(`Mail triggered ${args.content.toString()}`);

    const message: {
      mailTransport: IMailTransport;
      body: IMailOptions;
    } = JSON.parse(args.content);

    await message.mailTransport
      .send(message.body)
      .then(() => {
        receiver.ack(args);
      })
      .catch((error: any) => {
        Logger.error('Send mail failed', error, 'Mailer');
      });
  }

  public async queue(message: IMailOptions): Promise<void> {
    const body = message;
    this.renderTemplate(body.engine, resolve(body.template), body.templateData)
      .then((html: string) => {
        body.html = html;
        if (publisher.isConnected()) {
          publisher.send('mailer', { mailTransport: this.mailTransport, body });
        } else {
          Promise.reject(new Error(QUEUE_SEND_FAILED));
        }
      })
      .catch((error: any) => Promise.reject(new Error(error)));
  }

  public async send(args: any, message: any): Promise<void> {
    const body = message;
    this.renderTemplate(body.engine, resolve(body.template), body.templateData)
      .then((html: string) => {
        body.html = html;
        return this.mailTransport.send(body);
      })
      .catch((error: any) => {
        Logger.error('Send mail failed', error, 'Mailer');
        return Promise.reject(new Error(error));
      });
  }
}

export default Mail;
