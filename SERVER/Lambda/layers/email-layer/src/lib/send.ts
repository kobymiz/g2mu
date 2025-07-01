import { SESClient, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-ses';

export type SendEmailParams = {
  bcc?: string[];
  bodyHtml: string;
  cc?: string[] | undefined;
  from: string;
  subject: string;
  to: string[];
};

export const send = async (params: SendEmailParams) => {
  const cmdInput: SendEmailCommandInput = {
    Destination: {
      BccAddresses: params.bcc,
      CcAddresses: params.cc,
      ToAddresses: params.to,
    },
    Message: {
      Body: {
        Html: {
          Data: params.bodyHtml,
          Charset: 'UTF-8',
        },
      },
      Subject: {
        Data: params.subject,
        Charset: 'UTF-8',
      },
    },
    Source: params.from,
  };

  const cmd = new SendEmailCommand(cmdInput);

  let client;

  try {
    client = new SESClient();
    await client.send(cmd);
  } catch (error) {
    throw new Error('Could not send email', { cause: error });
  } finally {
    client?.destroy();
  }
};
