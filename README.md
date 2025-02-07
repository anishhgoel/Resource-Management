The **Resource Management System** is a full‑stack web application that provides an integrated solution for project tracking, resource allocation, and client communications. It includes features such as user authentication, project creation and updates, team management, real‑time notifications, and profile management.

## Features

- **Project Management:**
  - Create, update, delete, and view projects.
  - Assign team members and track allocated hours.
  - View project details including client information and status updates.
  
- **User Management:**
  - Register and log in users with roles (admin, team, client).
  - View and update user profiles.
  - Admin-only endpoints to manage users.
  
- **Real-Time Notifications:**
  - Socket.IO integration to broadcast notifications (e.g., when a team member is added).
  - Client-side persistence using localStorage for demo purposes.

- **Responsive Dashboard:**
  - Quick links to projects, profile, and admin controls.
  - Modern UI built with React and styled with Tailwind CSS.

## Tech Stack

- **Frontend:**
  - React (Create React App)
  - Tailwind CSS
  - React Router
  - Socket.IO Client

- **Backend:**
  - Node.js & Express.js
  - MongoDB & Mongoose
  - Socket.IO
  - JWT Authentication