/** @typedef {{ templateId: number|string, name: string, templateUrl?: string, totalDuration?: number }} Template */
/** @typedef {{ templateSubId: number|string, templateId: number|string, name: string, startOffset: number, duration: number }} TemplateSubEvent */

export const TEMPLATE_TYPES = Object.freeze({
  TEMPLATE: "Template",
  TEMPLATE_SUB_EVENT: "TemplateSubEvent",
});
// template.types.js

/**
 * @typedef {Object} SubEventTemplate
 * @property {string} title
 * @property {number} offsetDays - Days relative to the main event start date
 */

/**
 * @typedef {Object} Template
 * @property {string} id
 * @property {string} name
 * @property {SubEventTemplate[]} subEvents
 */

/**
 * @typedef {Object} SubEvent
 * @property {string} id
 * @property {string} title
 * @property {string} date - YYYY-MM-DD
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} eventUrl
 * @property {string} startDate - YYYY-MM-DD
 * @property {SubEvent[]} subEvents
 * @property {string} clonedFrom - ID of the original template
 * @property {string} createdAt - ISO Date string
 */