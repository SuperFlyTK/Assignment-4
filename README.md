# Smart Task Manager

Assignment 4 – Pre-Defense: Sessions & Security

---

## Project Overview

Smart Task Manager is a full-stack web application developed as part of **Assignment 4 (Pre-Defense: Sessions & Security)**.
The project extends Assignment 3 Part 2 by adding **session-based authentication, authorization, and security mechanisms**, while preserving the existing CRUD functionality and web interface.

The application allows users to manage tasks through a browser-based interface and demonstrates secure handling of authentication, sessions, cookies, and protected write operations.

---

## Live Deployment

Deployed application:
[https://assignment-4.onrender.com](https://assignment-4.onrender.com)

GitHub repository:
[https://github.com/SuperFlyTK/Assignment-4](https://github.com/SuperFlyTK/Assignment-4)

---

## Project Domain

The project domain is **task management**.

The main entity is **Task**, which contains realistic and meaningful fields used in real task management systems.
The database is pre-filled with realistic task data for demonstration purposes.

---

## Main Features

* Web-based task management interface
* Full CRUD functionality via browser UI
* Session-based authentication
* Authorization using middleware
* Protected write operations (create, update, delete)
* Secure cookie handling
* Password hashing using bcrypt
* Input validation and error handling
* Production deployment using Render

---

## Technologies Used

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* express-session
* bcrypt
* dotenv

### Frontend

* HTML
* CSS
* JavaScript (Fetch API)

### Deployment

* GitHub
* Render

---

## Project Structure

```
Assignment 4/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── taskController.js
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── taskRoutes.js
│   │   └── authRoutes.js
│   └── server.js
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## Database Design

### Task Entity

Each task contains the following fields:

* title (String, required)
* description (String)
* category (String)
* priority (Low, Medium, High)
* status (Pending, Completed)
* dueDate (Date)
* createdAt / updatedAt (timestamps)

The database contains more than **20 realistic task records**.

---

### User Entity

Authentication is based on the User entity:

* email (unique, required)
* password (hashed using bcrypt)
* createdAt / updatedAt

Passwords are **never stored in plain text**.

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| POST   | `/api/auth/login`  | User login               |
| POST   | `/api/auth/logout` | User logout              |
| GET    | `/api/auth/me`     | Get current user session |

---

### Tasks

| Method | Endpoint         | Access        | Description   |
| ------ | ---------------- | ------------- | ------------- |
| GET    | `/api/tasks`     | Public        | Get all tasks |
| POST   | `/api/tasks`     | Authenticated | Create task   |
| PUT    | `/api/tasks/:id` | Authenticated | Update task   |
| DELETE | `/api/tasks/:id` | Authenticated | Delete task   |

---

## Session-Based Authentication

Authentication is implemented using **express-session**.

### How sessions work in the project:

1. User logs in via the web interface
2. Server validates credentials
3. A session is created on the server
4. Session ID is stored in a cookie
5. Session persists between requests
6. Server identifies the user using the session ID

---

## Cookies Security

The application follows cookie security best practices:

* HttpOnly flag enabled
  Prevents JavaScript access to cookies
* Secure flag recommended for production
* Cookies do not store sensitive data
* Only session identifiers are stored

---

## Authentication vs Authorization

* **Authentication**: Verifies who the user is (login)
* **Authorization**: Determines what the user is allowed to do

In this project:

* Authentication is handled via sessions
* Authorization is implemented using middleware
* Only authorized users can modify data

---

## Authorization Middleware

Write operations are protected using middleware:

* Create task
* Update task
* Delete task

Unauthorized users receive HTTP status `401 Unauthorized`.

---

## Password Security

* Passwords are hashed using bcrypt
* Salt is applied automatically
* Passwords cannot be retrieved from the database
* Generic error messages are used:

  * "Invalid credentials"

---

## Validation and Error Handling

* Input validation is performed on server side
* Correct HTTP status codes are used
* Errors are handled without crashing the application
* Invalid requests are safely rejected

---

## Web Interface

All operations are performed through the **web interface**.

### UI Capabilities:

* Login form
* Task creation form
* Task update via form
* Task deletion via buttons
* Task list rendered dynamically
* API console inside UI (Postman replacement)

Postman is **not used during demonstration**.

---

## How to Run Locally

1. Clone the repository:

```
git clone https://github.com/SuperFlyTK/Assignment-4.git
```

2. Install dependencies:

```
npm install
```

3. Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_secret
```

4. Run the application:

```
npm run dev
```

5. Open in browser:

```
http://localhost:5000
```

---

## Deployment

The project is deployed on **Render**.

Deployment configuration:

* Build command: `npm install`
* Start command: `npm start`
* Environment variables configured in Render
* MongoDB Atlas used as production database

---

## Assignment Requirements Compliance

* Deployed application with public URL
* Realistic domain data
* Web UI with full CRUD
* Sessions-based authentication
* Authorization middleware
* Cookie security (HttpOnly)
* bcrypt password hashing
* Validation and error handling
* No Postman usage during defense

---

## Defense Demonstration

During defense, the following is demonstrated:

1. Open deployed application
2. Show restricted access for unauthorized users
3. Login through UI
4. Perform authorized CRUD operations
5. Explain sessions and cookies
6. Explain security measures

---

## Author

Student: Akhanov Yerdaulet, Kadirzhan Kozha
Astana IT University
Backend Development Course
