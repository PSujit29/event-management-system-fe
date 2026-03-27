/** @typedef {{ error: string, message: string, statusCode?: number }} ApiError */
/** @typedef {{ message: string }} ApiMessage */

export const API_STATUS = Object.freeze({
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
});
