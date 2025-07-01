import { sendFromTemplate, Template } from './send-from-template';

type PreAuditAssignmentTemplate = Template<
  'PRE_AUDIT_ASSIGNMENT',
  {
    preAuditUrl: string;
    supplierName: string;
    teamMemberName: string;
  }
>;

export type PreAuditAssignmentTemplateData = PreAuditAssignmentTemplate['data'];

export const sendPreAuditAssignment = sendFromTemplate<PreAuditAssignmentTemplate>('PRE_AUDIT_ASSIGNMENT');
