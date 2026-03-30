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
- [X] Confirm app reads API base URL from environment.
- [X] Add fallback message if API URL is missing in development.

### 0.2 Service contract cleanup

- [X] Update template clone service to accept payload:
  - name
  - description
  - eventUrl
  - startDate
- [X] Add missing event service function for POST event sub-events.
- [X] Ensure all service methods return normalized data shape where needed.

### 0.3 Guard correctness

- [X] Fix role route so unauthorized roles are redirected.
- [X] Ensure protected routes redirect to login when token is absent.
- [X] Handle stale token case by clearing auth and redirecting to login on 401 from me endpoint.

### 0.4 Navigation wiring

- [X] Add route entries for event detail page.
- [X] Add route entry for create event page.
- [X] Add route entry for event attendees page.
- [X] Add route entry for template detail page.
- [X] Add route entry for clone-template page.
- [X] Add route entry for student my-events page.

---

## Phase 1: Authentication MVP

### 1.1 Register flow

- [X] Keep role selection (Student, Teacher, Admin).
- [X] Validate conditional field:
  - Student requires roll number.
  - Teacher/Admin requires designation.
- [X] Submit to register API.
- [X] Show backend validation error message if available.
- [X] Redirect successful registration to login page.

### 1.2 Login flow

- [X] Validate email/password client-side.
- [X] Submit to login API.
- [X] Persist token and user in auth context/local storage.
- [ ] Fetch current user profile after login. (TODO: Comeback after backend)
- [X] Redirect by role:
  - Student -> events or my events
  - Teacher/Admin -> dashboard

### 1.3 Session behavior

- [X] On app load, if token exists and user missing, fetch me once.
- [X] If fetch me fails due to unauthorized, logout automatically.
- [X] Implement logout action in header/menu.

---

## Phase 2: Events Domain MVP

### 2.1 Event list page

- [X] Fetch events from GET events endpoint.
- [X] Add optional status filter UI (Upcoming, Ongoing, Completed).
- [X] Add loading skeleton.
- [X] Add empty state with helpful CTA.
- [X] Add error state with retry action.
- [X] Each event card includes:
  - name
  - start date
  - duration
  - status
  - view details action
- [X] Show create event button only for Teacher/Admin.

### 2.2 Event detail page

- [X] Fetch event by id.
- [X] Fetch sub-events by event id.
- [X] Render event core info and sub-events timeline/list.
- [X] Add register/cancel action for Student.
- [X] Add edit/delete actions for Teacher/Admin.
- [X] Add attendees button for Teacher/Admin.
- [X] Handle 404 not found gracefully.

### 2.3 Create event page

- [X] Build form fields:
  - name
  - description
  - startDate
  - duration
- [X] Validate required fields and date format.
- [X] Submit to create event API.
- [X] On success, navigate to newly created event detail.

### 2.4 Update and delete event actions

- [X] Add edit modal/page for Teacher/Admin.
- [X] Add delete confirmation dialog.
- [X] On delete success, redirect to event list and refresh.

---

## Phase 3: Registration Domain MVP

### 3.1 Student registration action

- [X] Register button on event detail calls register endpoint.
- [X] Prevent duplicate action while request is pending.
- [X] Display conflict message if already registered.
- [X] Update UI state immediately after success.

### 3.2 Student cancellation action

- [X] Cancel registration button for registered events.
- [X] Add confirmation step before cancellation.
- [X] Update UI state after successful cancellation.

### 3.3 Attendees page for Teacher/Admin

- [X] Create attendees page for event id.
- [X] Fetch attendees list endpoint.
- [X] Render table with:
  - student id
  - name
  - email
  - roll number
  - registration date
  - attendance status
- [X] Add empty state when no attendees.

### 3.4 Student my events page

- [X] Build page for GET users me events endpoint.
- [X] Show cards/table with registration date and event summary.
- [X] Add quick link to event detail.

---

## Phase 4: Template Domain MVP

### 4.1 Template list page

- [X] Fetch templates.
- [X] Render list with name and total duration.
- [X] Add open detail action.

### 4.2 Template detail page

- [X] Fetch template by id.
- [X] Render template metadata and ordered template sub-events.
- [X] Add clone button for Admin only.

### 4.3 Clone template to event page

- [X] Build clone form fields:
  - name
  - description
  - startDate
- [X] Submit payload to create-event from template endpoint.
- [X] Show generated event summary after success.
- [X] Navigate to new event detail page.

---

## Phase 5: Dashboard and Role UX MVP

### 5.1 Admin dashboard

- [X] Fetch events for dashboard cards.
- [X] Compute total, ongoing, upcoming counts from API data.
- [X] Optionally show nearest upcoming events and latest sub-events.
- [X] Ensure status logic uses Completed instead of Past.

### 5.2 Student dashboard

- [X] Replace placeholder with my-events summary.
- [X] Show upcoming registrations count.
- [X] Show nearest upcoming registered event.

### 5.3 Sidebar and header role awareness

- [X] Render nav items based on role.
- [X] Hide organizer-only pages for Student.
- [X] Update title mapping for newly added routes.

---

## Phase 6: Error Handling and Utility Layer

### 6.1 Centralized error parsing

- [X] Use error utility for readable toast messages.
- [X] Map common backend statuses:
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

- [X] GET events -> Event list and dashboard.
- [X] GET events by id -> Event detail.
- [X] POST events -> Create event page.
- [ ] PUT events by id -> Edit event flow.
- [X] DELETE events by id -> Delete action.
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

- [X] Finish Phase 0 first.
- [X] Implement Phase 1 auth stabilization.
- [ ] Deliver Phase 2 events pages.
- [ ] Deliver Phase 3 registration flows.
- [ ] Deliver Phase 4 templates flows.
- [ ] Replace remaining placeholders in Phase 5.
- [ ] Run Phase 6 and 7 quality pass.
- [ ] Execute manual test script and close MVP.
