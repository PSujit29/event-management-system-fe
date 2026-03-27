/*
BACKEND NOTES:

DATABASE MODELS:

1. The Users (Actors)

Entity

Attributes

Student

StudentID (PK)

Name

Email (Unique)

RollNumber (Unique)

PasswordHash

Teacher

TeacherID (PK)

Name

Email (Unique)

Designation

PasswordHash

Admin

AdminID (PK)

Name

Email (Unique)

Designation

PasswordHash

Since Students, Teachers, and Admins share many fields (Name, Email, Password), you could combine them into a single User table with a Role column (e.g., Role = 'Student'). However, keeping them separate is perfectly fine if they have very distinct workflows in your college.


2. The Event Core

Instead of a "list of sub-events" living inside the Event, the Sub-Event will carry an EventID to link itself back to its parent

Entity

Attributes

Description / Notes

Event

EventID (PK)

Name

Description

EventURL (Unique)

StartDate

Duration (or EndDate)

Status

Status =  enum ( Upcoming, Ongoing, Completed).

Sub-Event

SubEventID (PK)

EventID (FK)

Name

Description

StartDate

Duration


3. The Template System

Entity

Attributes

Description / Notes

Template

TemplateID (PK)

Name

TemplateURL

TotalDuration

Template Sub-Event

TemplateSubID (PK)

TemplateID (FK)

Name

StartOffset

Duration

StartOffset:

 Instead of a hard date, use an offset (e.g., "Starts on Day 2 of the event").


4. The Relationships 

Because a student can attend many events, and an event can have many students, we use a "Many-to-Many" junction table. This replaces the list(event url) in your original design.

Entity

Attributes

Description / Notes

Event Registration

(Student <-> Event)

RegistrationID (PK)

StudentID (FK)

EventID (FK)

RegistrationDate

Links a Student to an Event. You can add fields like AttendanceStatus here.

Event Organizer

(Teacher/Admin <-> Event)

OrganizerID (PK)

TeacherID (FK, Nullable)

AdminID (FK, Nullable)

EventID (FK)

Role

Links a Teacher or Admin to an Event. The Role could be "Main Coordinator", "Judge", etc.

Notification Log

NotificationID (PK)

EventID (FK)

Message

SentDate

Replaces the static "notification" field so you can send multiple updates per event.


Summary of Relationships

1-to-Many (1:N):

One Event has many Sub-Events.

One Template has many Template Sub-Events.

One Event has many Notifications.

Many-to-Many (M:N):

Students and Events (resolved by Event Registration table).

Teachers/Admins and Events (resolved by Event Organizer table).


RESTful APIs

 1. Authentication & Users

These routes handle user onboarding and session management. 

Method

Endpoint

Description

Auth Required

POST

/api/auth/register

Creates a new Student, Teacher, or Admin.

None

POST

/api/auth/login

Authenticates a user and returns a token (e.g., JWT).

None

GET

/api/users/me

Fetches the profile of the currently logged-in user.

Any valid user


 2. Event Management API routes

Method

Endpoint

Description

Auth Required

GET

/api/events

Lists all events (can add query params like ?status=upcoming).

Any valid user

GET

/api/events/{eventId}

Gets full details of a specific event.

Any valid user

POST

/api/events

Creates a new main Event.

Admin / Teacher

PUT

/api/events/{eventId}

Updates event details (name, date, status).

Admin / Teacher

DELETE

/api/events/{eventId}

Cancels/Deletes an event.

Admin / Teacher

POST

/api/events/{eventId}/sub-events

Adds a new sub-event to an existing Event.

Admin / Teacher

GET

/api/events/{eventId}/sub-events

Lists all sub-events for a specific Event.

Any valid user


3. Event Registration (The Many-to-Many Link)

These routes interact with the "Event Registration" junction table we designed, allowing students to respond to event and organizers to see attendee lists.

Method

Endpoint

Description

Auth Required

POST

/api/events/{eventId}/register

Registers the logged-in Student for the event.

Student

DELETE

/api/events/{eventId}/register

Cancels a Student's registration.

Student

GET

/api/events/{eventId}/attendees

Lists all Students registered for a specific event.

Admin / Teacher

GET

/api/users/me/events

Lists all events the logged-in student is registered for.

Student


 4. Template System

Templates allow quick creation of recurring events. The most important MVP route here is the ability to generate a real event from a template.

Method

Endpoint

Description

Auth Required

GET

/api/templates

Lists all available event templates.

Admin 

GET

/api/templates/{templateId}

Gets details of a template and its sub-events.

Admin 

POST

/api/templates/{templateId}/create-event

Clones a template to instantly generate a new Event and its Sub-Events.

Admin 

 Implementation Notes:

we don't have a route to "add a student to an event" inside the user route. We manage that under the event domain (`/api/events/.../register`).


JSON Request response for all api call of auth

1. POST /api/auth/register

Description: Creates a new user.

Request Body (Example for a Student):

{

  "role": "Student",

  "name": "John Doe",

  "email": "john.doe@college.edu",

  "password": "securepassword123",

  "rollNumber": "CS-2024-001"

}

(Note: If registering a Teacher/Admin, rollNumber would be replaced by designation).

Response (201 Created):

DO NOT return the PasswordHash for security reasons.

{

  "message": "User registered successfully",

  "user": {

    "id": 1,

    "role": "Student",

    "name": "John Doe",

    "email": "john.doe@college.edu",

    "rollNumber": "CS-2024-001"

  }

}

2. POST /api/auth/login

Description: Authenticates a user and returns a JWT token.

Request Body:

{

  "email": "john.doe@college.edu",

  "password": "securepassword123"

}

Response (200 OK):

{

  "message": "Login successful",

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9s...",

  "user": {

    "id": 1,

    "role": "Student",

    "name": "John Doe",

    "email": "john.doe@college.edu"

  }

}

Response (401 Unauthorized):

{

  "error": "Unauthorized",

  "message": "Invalid email or password"

}

3. GET /api/users/me

Description: Fetches the profile of the currently logged-in user.

(Requires Header: Authorization: Bearer <token>)

Request Body:  None (GET requests usually don't have bodies).

Response (200 OK - Example for Teacher):

{

  "id": 102,

  "role": "Teacher",

  "name": "Dr. Jane Smith",

  "email": "jane.smith@college.edu",

  "designation": "Associate Professor"

}

Response (401 Unauthorized - if token is missing/expired):

{

  "error": "Unauthorized",

  "message": "Token is missing or expired"

}


2. JSON FOR EVENT ROUTES:

1. GET /api/events

Description: Lists all events. Supports query parameters (e.g., GET /api/events?status=Upcoming).

Request Body: None

Response (200 OK): (Sub events pathaunu parxa ki nai?????)

[

{

    "eventId": 1,

    "name": "Annual Tech Symposium 2026",

    "description": "The biggest tech gathering of the year.",

    "eventUrl": "tech-symposium-2026",

    "startDate": "2026-05-10T09:00:00Z",

    "duration": 48, 

    "status": "Upcoming"

  },

  {

    "eventId": 2,

    "name": "Spring Hackathon",

    "description": "24-hour coding challenge.",

    "eventUrl": "spring-hackathon-2026",

    "startDate": "2026-04-15T18:00:00Z",

    "duration": 24,

    "status": "Ongoing"

  }

]

2. GET /api/events/{eventId}

Description: Gets full details of a specific event.

Request Body: None

Response (200 OK):

{

  "eventId": 1,

  "name": "Annual Tech Symposium 2026",

  "description": "The biggest tech gathering of the year.",

  "eventUrl": "tech-symposium-2026",

  "startDate": "2026-05-10T09:00:00Z",

  "duration": 48,

  "status": "Upcoming"

}

(Response 404 Not Found: { "error": "Not Found", "message": "Event does not exist" })

3. POST /api/events

Description: Creates a new main Event (Admin / Teacher only).

Request Body:

eventId is not sent because the database auto-generates it. status is also omitted here because a newly created event should default to "Upcoming".

{

  "name": "Cultural Fest 2026",

  "description": "Annual college cultural festival showcasing student talents.",

  "eventUrl": "cultural-fest-2026",

  "startDate": "2026-10-20T10:00:00Z",

  "duration": 72

}

Response (201 Created):

{

  "message": "Event created successfully",

  "event": {

    "eventId": 3,

    "name": "Cultural Fest 2026",

    "description": "Annual college cultural festival showcasing student talents.",

    "eventUrl": "cultural-fest-2026",

    "startDate": "2026-10-20T10:00:00Z",

    "duration": 72,

    "status": "Upcoming"

}

}

4. PUT /api/events/{eventId}

Description: Updates event details.

Request Body:

In a PUT request, the frontend sends the updated fields. Maybe they want to change the status to "Ongoing".

{

  "name": "Cultural Fest 2026",

  "description": "Updated description: Now featuring guest artist XYZ!",

  "eventUrl": "cultural-fest-2026",

  "startDate": "2026-10-20T10:00:00Z",

  "duration": 72,

  "status": "Ongoing"

}

Response (200 OK):

{

  "message": "Event updated successfully",

  "event": {

    "eventId": 3,

    "name": "Cultural Fest 2026",

    "description": "Updated description: Now featuring guest artist XYZ!",

    "eventUrl": "cultural-fest-2026",

    "startDate": "2026-10-20T10:00:00Z",

    "duration": 72,

    "status": "Ongoing"

  }

}

5. DELETE /api/events/{eventId}

Description: Cancels/Deletes an event.

Request Body: None

Response (200 OK):

{

  "message": "Event successfully deleted",

  "eventId": 3

}

6. POST /api/events/{eventId}/sub-events

Description: Adds a new sub-event to an existing Event.

Request Body:

eventId is in the URL (e.g., /api/events/1/sub-events), we do not need to send in the req body.

{

  "name": "Opening Ceremony",

  "description": "Kickoff and keynote speech.",

  "startDate": "2026-05-10T09:00:00Z",

  "duration": 2

}

Response (201 Created): {

  "message": "Sub-event added successfully",

  "subEvent": {

    "subEventId": 101,

    "eventId": 1,

    "name": "Opening Ceremony",

    "description": "Kickoff and keynote speech.",

    "startDate": "2026-05-10T09:00:00Z",

    "duration": 2

  }}

7. GET /api/events/{eventId}/sub-events

Description: Lists all sub-events for a specific Event.

Request Body: None

Response (200 OK):

[

{

    "subEventId": 101,

    "eventId": 1,

    "name": "Opening Ceremony",

    "description": "Kickoff and keynote speech.",

    "startDate": "2026-05-10T09:00:00Z",

    "duration": 2

  },

  {

    "subEventId": 102,

    "eventId": 1,

    "name": "Web Dev Workshop",

    "description": "Hands-on React workshop.",

    "startDate": "2026-05-10T12:00:00Z",

    "duration": 3

  }

]


3. JSON OUTPUTS FOR EVENT REGISTRATION:

1. POST /api/events/{eventId}/register

Description: Registers the logged-in Student for the event.

Request Body:Because eventId is in the URL and the studentId comes from the JWT token, the request body is empty

Response (201 Created):

{

  "message": "Successfully registered for the event",

  "registration": {

    "registrationId": 501,

    "eventId": 1,

    "studentId": 10,

    "registrationDate": "2026-03-22T14:00:00Z",

    "attendanceStatus": "Pending"

  }

}

Response (400 Bad Request / 409 Conflict):

{

  "error": "Conflict",

  "message": "Student is already registered for this event"

}

2. DELETE /api/events/{eventId}/register

Description: Cancels a Student's registration.

Request Body: None

Response (200 OK):

{

  "message": "Registration cancelled successfully",

  "eventId": 1

}

3. GET /api/events/{eventId}/attendees

Description: Lists all Students registered for a specific event (Admin / Teacher only).

Request Body: None

Response (200 OK):

[

{

    "studentId": 10,

    "name": "John Doe",

    "email": "john.doe@college.edu",

    "rollNumber": "CS-2024-001",

    "registrationDate": "2026-03-22T14:00:00Z",

    "attendanceStatus": "Pending"

  },

  {

    "studentId": 14,

    "name": "Sita Sharma",

    "email": "sita.sharma@college.edu",

    "rollNumber": "CS-2024-015",

    "registrationDate": "2026-03-21T09:30:00Z",

    "attendanceStatus": "Confirmed"

  }

]

4. GET /api/users/me/events

Description: Lists all events the logged-in student is registered for.

Request Body: None

Response (200 OK):

This is the reverse of the previous endpoint. It combines the Event table with the Event Registration table so the student can see their own schedule.

[

{

    "registrationId": 501,

    "registrationDate": "2026-03-22T14:00:00Z",

    "event": {

      "eventId": 1,

      "name": "Annual Tech Symposium 2026",

      "startDate": "2026-05-10T09:00:00Z",

      "duration": 48,

      "status": "Upcoming"

    }

  },

  {

    "registrationId": 508,

    "registrationDate": "2026-02-15T11:20:00Z",

    "event": {

      "eventId": 2,

      "name": "Spring Hackathon",

      "startDate": "2026-04-15T18:00:00Z",

      "duration": 24,

      "status": "Ongoing"

    }

  }

]


4. JSON Outputs for template.

GET /api/templates

Description: Lists all available event templates.

Request Body: None

Response (200 OK):

[

{

    "templateId": 1,

    "name": "Standard 3-Day Hackathon",

    "templateUrl": "standard-3-day-hackathon",

    "totalDuration": 72

  },

  {

    "templateId": 2,

    "name": "1-Day Guest Lecture Setup",

    "templateUrl": "guest-lecture-setup",

    "totalDuration": 4

  }

]

2. GET /api/templates/{templateId}

Description: Gets details of a template and its sub-events.

Request Body: None

Response (200 OK):

{

  "templateId": 1,

  "name": "Standard 3-Day Hackathon",

  "templateUrl": "standard-3-day-hackathon",

  "totalDuration": 72,

  "templateSubEvents":[

    {

      "templateSubId": 101,

      "name": "Kickoff & Team Formation",

      "startOffset": 0,

      "duration": 2

    },

    {

      "templateSubId": 102,

      "name": "Mid-Point Check-in",

      "startOffset": 24,

      "duration": 1

    },

    {

      "templateSubId": 103,

      "name": "Project Submission Deadline",

      "startOffset": 48,

      "duration": 1

    }

  ]

}

POST /api/templates/{templateId}/create-event

Description: Clones a template to instantly generate a new Event and its Sub-Events.

Request Body:

To clone a template into a real event, the Admin must provide the new specific details (the new name, the new URL, and the actual real-world start date). The backend will use this startDate + the template's startOffset to calculate all the sub-event dates automatically!

{

  "name": "Winter Hackathon 2026",

  "description": "Our annual winter coding competition based on the standard 3-day template.",

  "eventUrl": "winter-hackathon-2026",

  "startDate": "2026-12-01T09:00:00Z"

}

Response (201 Created):

{

  "message": "Event successfully generated from template",

  "event": {

    "eventId": 5,

    "name": "Winter Hackathon 2026",

    "description": "Our annual winter coding competition based on the standard 3-day template.",

    "eventUrl": "winter-hackathon-2026",

    "startDate": "2026-12-01T09:00:00Z",

    "duration": 72,

    "status": "Upcoming",

    "subEvents":[

      {

        "subEventId": 301,

        "eventId": 5,

        "name": "Kickoff & Team Formation",

        "startDate": "2026-12-01T09:00:00Z",

        "duration": 2

      },

      {

        "subEventId": 302,

        "eventId": 5,

        "name": "Mid-Point Check-in",

        "startDate": "2026-12-02T09:00:00Z",

        "duration": 1

      },

      {

        "subEventId": 303,

        "eventId": 5,

        "name": "Project Submission Deadline",

        "startDate": "2026-12-03T09:00:00Z",

        "duration": 1

      }

    ]

  }

}


src/

│

├── assets/                 # Static assets (images, global CSS)

├── components/             # (Ignored as it is subjective)

│

├── context/                # Global React Contexts

│   └── AuthContext.jsx     # Stores JWT token & current logged-in user details

│

├── hooks/                  # Custom React Hooks for logic reusability

│   ├── useAuth.js          # Wraps AuthContext for easy access

│   ├── useRoleAccess.js    # Hook to check if user is 'Student', 'Teacher', or 'Admin'

│   ├── useEvents.js        # Data fetching hooks for events (swr or react-query logic)

│   └── useTemplates.js     

│

├── layouts/                # Wrapper components for page structures

│   ├── AuthLayout.jsx      # Centered layout for Login/Register (no sidebars)

│   └── DashboardLayout.jsx # Main layout with Navbar/Sidebar (varies by role)

│

├── lib/                    # 3rd-party library configurations

│   └── apiClient.js        # Axios/Fetch instance (auto-injects `Authorization: Bearer <token>`)

│

├── pages/                  # Route-level components mapped to user workflows

│   ├── auth/

│   │   ├── LoginPage.jsx

│   │   └── RegisterPage.jsx

│   ├── dashboard/

│   │   ├── StudentDashboardPage.jsx   # Displays GET /api/users/me/events

│   │   └── OrganizerDashboardPage.jsx # Overview for Admins/Teachers

│   ├── events/

│   │   ├── EventListPage.jsx          # Displays GET /api/events

│   │   ├── EventDetailPage.jsx        # Displays GET /api/events/{eventId} & sub-events

│   │   ├── CreateEventPage.jsx        # POST /api/events (Admin/Teacher only)

│   │   └── EventAttendeesPage.jsx     # GET /api/events/{eventId}/attendees

│   └── templates/

│       ├── TemplateListPage.jsx       # Displays GET /api/templates

│       ├── TemplateDetailPage.jsx     # Displays GET /api/templates/{templateId}

│       └── CloneTemplatePage.jsx      # POST /api/templates/{templateId}/create-event

│

├── router/                 # Routing logic and Guards

│   ├── AppRouter.jsx       # Main react-router-dom configuration

│   ├── ProtectedRoute.jsx  # Guard: Checks if user has a valid JWT

│   └── RoleRoute.jsx       # Guard: Checks if user matches allowed roles (e.g.,allowedRoles={['Admin', 'Teacher']})

│

├── services/               # API abstraction layer (matches your REST structure perfectly)

│   ├── auth.service.js         

│   ├── event.service.js        

│   ├── registration.service.js 

│   └── template.service.js     

│

├── types/                  # TypeScript interfaces reflecting your DB models & JSON payloads

│   ├── auth.types.js       # Login/Register request & response types

│   ├── user.types.js       # User model, Roles Enum

│   ├── event.types.js      # Event, SubEvent, EventStatus Enum

│   ├── template.types.js   # Template, TemplateSubEvent

│   └── api.types.js        # Generic error responses (401, 404 wrappers)

│

└── utils/                  # Pure functions and helpers

    ├── date.utils.js       # Formats "2026-05-10T09:00:00Z" to UI-friendly dates

    ├── offset.utils.js     # Calculates sub-event dates using template `StartOffset`

    ├── storage.utils.js    # localStorage wrapper for JWT ("getItem", "setItem")

    └── error.utils.js      # Parses backend 400/409/401 messages into UI toast alerts

•••
Go to
Page
*/