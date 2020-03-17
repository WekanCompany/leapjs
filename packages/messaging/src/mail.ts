import {
  Logger,
  injectable,
  ILeapContainer,
  IConstructor,
} from '@leapjs/common';
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
  private static mailTransportStatic: IMailTransport;
  private apiKey: string;
  private logger = Logger.getInstance();
  private channel = 'mailer';

  private async renderTemplate(
    engine: 'ejs' | 'pug',
    template: string,
    templateData: {},
  ): Promise<string> {
    if (engine) {
      // TODO Add handlebars support
      return Promise.resolve(this.render[engine](template, templateData)).catch(
        (error) => {
          this.logger.error('Failed to render template', error, 'Mailer');
          return Promise.reject(new Error(ERROR_RENDERING_TEMPLATE));
        },
      );
    }
    return Promise.reject(new Error(ENGINE_NOT_SUPPORTED));
  }

  constructor(mailTransport: IConstructor<any>, container: ILeapContainer) {
    this.mailTransport = container.resolve(mailTransport);
    Mail.mailTransportStatic = this.mailTransport;
  }

  public init(apiKey: string): void {
    this.apiKey = apiKey;
    this.mailTransport.init(this.apiKey);
  }

  public setChannel(channel: string): void {
    this.channel = channel;
  }

  public static async defaultMailHandler(args: any): Promise<void> {
    const message: {
      body: IMailOptions;
    } = JSON.parse(args.content);

    await Mail.mailTransportStatic
      .send(message.body)
      .then(() => {
        receiver.ack(args);
      })
      .catch((error: any) => {
        Logger.getInstance().error('Send mail failed', error, 'Mailer');
      });
  }

  public async queue(message: IMailOptions): Promise<void> {
    const body = message;
    this.renderTemplate(body.engine, resolve(body.template), body.templateData)
      .then((html: string) => {
        body.html = html;
        if (publisher.isConnected()) {
          publisher.send(this.channel, { body });
        } else {
          Promise.reject(new Error(QUEUE_SEND_FAILED));
        }
      })
      .catch((error: any) => Promise.reject(new Error(error)));
  }

  public async send(message: IMailOptions): Promise<void> {
    const body = message;
    this.renderTemplate(body.engine, resolve(body.template), body.templateData)
      .then((html: string) => {
        body.html = html;
        return this.mailTransport.send(body);
      })
      .catch((error: any) => {
        this.logger.error('Send mail failed', error, 'Mailer');
        return Promise.reject(new Error(error));
      });
  }
}

export default Mail;
