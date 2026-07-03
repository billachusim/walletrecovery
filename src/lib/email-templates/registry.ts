import type { ComponentType } from 'react'
import { template as assessmentReceivedTemplate } from './assessment-received'
import { template as caseOpenedTemplate } from './case-opened'
import { template as caseStatusUpdateTemplate } from './case-status-update'
import { template as operatorNewAssessmentTemplate } from './operator-new-assessment'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'assessment-received': assessmentReceivedTemplate,
  'case-opened': caseOpenedTemplate,
  'case-status-update': caseStatusUpdateTemplate,
  'operator-new-assessment': operatorNewAssessmentTemplate,
}
