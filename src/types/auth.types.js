/** @typedef {{ email: string, password: string }} LoginRequest */
/** @typedef {{ role: string, name: string, email: string, password: string, rollNumber?: string, designation?: string }} RegisterRequest */
/** @typedef {{ token: string, user: import('./user.types').User }} AuthResponse */

export const AUTH_TYPES = Object.freeze({
  LOGIN_REQUEST: "LoginRequest",
  REGISTER_REQUEST: "RegisterRequest",
  AUTH_RESPONSE: "AuthResponse",
});
