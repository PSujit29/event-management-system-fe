/** @typedef {'Student' | 'Teacher' | 'Admin'} UserRole */
/** @typedef {{ id?: number|string, role: UserRole, name: string, email: string, rollNumber?: string, designation?: string }} User */

export const Roles = Object.freeze({
    STUDENT: "Student",
    TEACHER: "Teacher",
    ADMIN: "Admin",
});
