import { Data, renderFile } from 'ejs';
import { resolve } from 'path';
import { send, SendEmailParams } from './send';
import { TEMPLATES } from './templates/templates-map';

type TemplateType = keyof typeof TEMPLATES;

export type Template<
  T extends TemplateType = TemplateType,
  D extends Data = Data,
> = {
  type: T;
  data: D;
};

export const sendFromTemplate = <T extends Template>(
  templateType: T['type'],
) => async (
  data: T['data'],
  emailParams: Omit<SendEmailParams, 'bodyHtml'>,
) => {
  const fileName = TEMPLATES[templateType];
  const path = resolve(__dirname, './templates', fileName);
  const bodyHtml = await renderFile(path, data);
  return send({... emailParams, bodyHtml });
};
