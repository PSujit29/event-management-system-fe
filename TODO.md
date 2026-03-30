# Event Management System Frontend MVP TODO

This checklist is optimized for shipping a working MVP that aligns with your backend notes.

## MVP Goal

Deliver a role-based frontend where:

- Any user can register and login.
- Student can browse events, view details, register/cancel registration, and view own registrations.
- Teacher/Admin can create and manage events, view attendees, and generate events from templates.
- Core guarded routing and API error handling are reliable.

## MVP Definition of Done

- All core backend endpoints in notes are consumed by at least one screen or action.
- No Work In Progress placeholders remain for MVP routes.
- Role-based access is enforced in UI routing.
- Basic loading, empty, success, and error states are implemented for all API-driven views.
- Manual test pass for Student and Teacher/Admin happy paths.

---

## Phase 0: Foundation and Cleanup

### 0.1 Auth and environment cleanup

- [ ] Remove dummy login transformation from login form. (i dont have backend ready so ignore)
- [x] Confirm app reads API base URL from environment.
- [x] Add fallback message if API URL is missing in development.

### 0.2 Service contract cleanup

- [x] Update template clone service to accept payload:
  - name
  - description
  - eventUrl
  - startDate
- [x] Add missing event service function for POST event sub-events.
- [x] Ensure all service methods return normalized data shape where needed.

### 0.3 Guard correctness

- [x] Fix role route so unauthorized roles are redirected.
- [x] Ensure protected routes redirect to login when token is absent.
- [x] Handle stale token case by clearing auth and redirecting to login on 401 from me endpoint.

### 0.4 Navigation wiring

- [x] Add route entries for event detail page.
- [x] Add route entry for create event page.
- [x] Add route entry for event attendees page.
- [x] Add route entry for template detail page.
- [x] Add route entry for clone-template page.
- [x] Add route entry for student my-events page.

---

## Phase 1: Authentication MVP

### 1.1 Register flow

- [x] Keep role selection (Student, Teacher, Admin).
- [x] Validate conditional field:
  - Student requires roll number.
  - Teacher/Admin requires designation.
- [x] Submit to register API.
- [x] Show backend validation error message if available.
- [x] Redirect successful registration to login page.

### 1.2 Login flow

- [x] Validate email/password client-side.
- [x] Submit to login API.
- [x] Persist token and user in auth context/local storage.
- [ ] Fetch current user profile after login. (TODO: Comeback after backend)
- [x] Redirect by role:
  - Student -> events or my events
  - Teacher/Admin -> dashboard

### 1.3 Session behavior

- [x] On app load, if token exists and user missing, fetch me once.
- [x] If fetch me fails due to unauthorized, logout automatically.
- [x] Implement logout action in header/menu.

---

## Phase 2: Events Domain MVP

### 2.1 Event list page

- [x] Fetch events from GET events endpoint.
- [x] Add optional status filter UI (Upcoming, Ongoing, Completed).
- [x] Add loading skeleton.
- [x] Add empty state with helpful CTA.
- [x] Add error state with retry action.
- [x] Each event card includes:
  - name
  - start date
  - duration
  - status
  - view details action
- [x] Show create event button only for Teacher/Admin.

### 2.2 Event detail page

- [x] Fetch event by id.
- [x] Fetch sub-events by event id.
- [x] Render event core info and sub-events timeline/list.
- [x] Add register/cancel action for Student.
- [x] Add edit/delete actions for Teacher/Admin.
- [x] Add attendees button for Teacher/Admin.
- [x] Handle 404 not found gracefully.

### 2.3 Create event page

- [x] Build form fields:
  - name
  - description
  - startDate
  - duration
- [x] Validate required fields and date format.
- [x] Submit to create event API.
- [x] On success, navigate to newly created event detail.

### 2.4 Update and delete event actions

- [x] Add edit modal/page for Teacher/Admin.
- [x] Add delete confirmation dialog.
- [x] On delete success, redirect to event list and refresh.

---

## Phase 3: Registration Domain MVP

### 3.1 Student registration action

- [x] Register button on event detail calls register endpoint.
- [x] Prevent duplicate action while request is pending.
- [x] Display conflict message if already registered.
- [x] Update UI state immediately after success.

### 3.2 Student cancellation action

- [x] Cancel registration button for registered events.
- [x] Add confirmation step before cancellation.
- [x] Update UI state after successful cancellation.

### 3.3 Attendees page for Teacher/Admin

- [x] Create attendees page for event id.
- [x] Fetch attendees list endpoint.
- [x] Render table with:
  - student id
  - name
  - email
  - roll number
  - registration date
  - attendance status
- [x] Add empty state when no attendees.

### 3.4 Student my events page

- [x] Build page for GET users me events endpoint.
- [x] Show cards/table with registration date and event summary.
- [x] Add quick link to event detail.

---

## Phase 4: Template Domain MVP

### 4.1 Template list page

- [x] Fetch templates.
- [x] Render list with name and total duration.
- [x] Add open detail action.

### 4.2 Template detail page

- [x] Fetch template by id.
- [x] Render template metadata and ordered template sub-events.
- [x] Add clone button for Admin only.

### 4.3 Clone template to event page

- [x] Build clone form fields:
  - name
  - description
  - startDate
- [x] Submit payload to create-event from template endpoint.
- [x] Show generated event summary after success.
- [x] Navigate to new event detail page.

---

## Phase 5: Dashboard and Role UX MVP

### 5.1 Admin dashboard

- [ ] Fetch events for dashboard cards.
- [ ] Compute total, ongoing, upcoming counts from API data.
- [ ] Optionally show nearest upcoming events and latest sub-events.
- [x] Ensure status logic uses Completed instead of Past.

### 5.2 Student dashboard

- [ ] Replace placeholder with my-events summary.
- [ ] Show upcoming registrations count.
- [ ] Show nearest upcoming registered event.

### 5.3 Sidebar and header role awareness

- [x] Render nav items based on role.
- [x] Hide organizer-only pages for Student.
- [x] Update title mapping for newly added routes.

---

## Phase 6: Error Handling and Utility Layer

### 6.1 Centralized error parsing

- [ ] Use error utility for readable toast messages.
- [ ] Map common backend statuses:
  - 400 invalid request
  - 401 unauthorized
  - 404 not found
  - 409 conflict
  - 500 fallback

### 6.2 Date and format consistency

- [ ] Use shared date utilities for all date displays.
- [ ] Ensure timezone display is consistent across pages.
- [ ] Keep duration unit formatting consistent.

### 6.3 Storage consistency

- [ ] Use storage utility wrappers where practical.
- [ ] Keep token and user keys consistent across app.

---

## Phase 7: MVP Quality Pass

### 7.1 Loading and disabled states

- [ ] Every mutation button shows pending state.
- [ ] Forms disable submit while request is in flight.
- [ ] Re-enable controls after completion/failure.

### 7.2 Empty states

- [ ] Event list empty state.
- [ ] Sub-events empty state.
- [ ] Templates empty state.
- [ ] Attendees empty state.
- [ ] My events empty state.

### 7.3 Route validation

- [ ] Unknown URL shows 404 page.
- [ ] Direct access to protected routes redirects unauthenticated users.
- [ ] Direct access to forbidden role routes redirects to allowed page.

### 7.4 Basic accessibility

- [ ] Labels connected to form inputs.
- [ ] Button text is action specific.
- [ ] Color contrast is acceptable for core text/buttons.

---

## Endpoint-to-UI Coverage Checklist

### Authentication and users

- [ ] POST auth register -> Register page submit.
- [ ] POST auth login -> Login page submit.
- [ ] GET users me -> Auth bootstrap and profile display.

### Events

- [x] GET events -> Event list and dashboard.
- [x] GET events by id -> Event detail.
- [x] POST events -> Create event page.
- [ ] PUT events by id -> Edit event flow.
- [x] DELETE events by id -> Delete action.
- [ ] POST events by id sub-events -> Add sub-event form.
- [ ] GET events by id sub-events -> Event detail sub-event list.

### Registration

- [ ] POST events by id register -> Student register action.
- [ ] DELETE events by id register -> Student cancel action.
- [ ] GET events by id attendees -> Attendees page.
- [ ] GET users me events -> Student my-events page.

### Templates

- [ ] GET templates -> Template list page.
- [ ] GET templates by id -> Template detail page.
- [ ] POST templates by id create-event -> Clone template page.

---

## Manual Test Script for MVP Signoff

### Student happy path

- [ ] Register as Student.
- [ ] Login as Student.
- [ ] Browse events list.
- [ ] Open event detail.
- [ ] Register to event.
- [ ] See event appear in my events page.
- [ ] Cancel registration.
- [ ] Confirm event removed from my events.
- [ ] Logout.

### Teacher/Admin happy path

- [ ] Login as Teacher/Admin.
- [ ] Open dashboard and verify counts.
- [ ] Create event.
- [ ] Add sub-event.
- [ ] Edit event status/details.
- [ ] Open attendees page.
- [ ] View templates.
- [ ] Clone template to new event.
- [ ] Delete a test event.
- [ ] Logout.

### Security and route checks

- [ ] Unauthenticated user cannot open user routes.
- [ ] Student cannot access organizer-only views.
- [ ] Admin/Teacher can access organizer views.

---

## Out of Scope for MVP (Do Later)

- Advanced search and pagination.
- Rich analytics and charts.
- Attendance status editing workflows.
- Notifications center with history feed.
- Password reset completion flow if backend not ready.
- Full TypeScript migration for all files.
- Offline support and advanced caching.

---

## Suggested Execution Order

- [x] Finish Phase 0 first.
- [x] Implement Phase 1 auth stabilization.
- [ ] Deliver Phase 2 events pages.
- [ ] Deliver Phase 3 registration flows.
- [ ] Deliver Phase 4 templates flows.
- [ ] Replace remaining placeholders in Phase 5.
- [ ] Run Phase 6 and 7 quality pass.
- [ ] Execute manual test script and close MVP.
