/** @typedef {{ templateId: number|string, name: string, templateUrl?: string, totalDuration?: number }} Template */
/** @typedef {{ templateSubId: number|string, templateId: number|string, name: string, startOffset: number, duration: number }} TemplateSubEvent */

export const TEMPLATE_TYPES = Object.freeze({
  TEMPLATE: "Template",
  TEMPLATE_SUB_EVENT: "TemplateSubEvent",
});
