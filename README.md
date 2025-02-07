The **Resource Management System** is a full‑stack web application that provides an integrated solution for project tracking, resource allocation, and client communications. It includes features such as user authentication, project creation and updates, team management, real‑time notifications, and profile management.

---

## Try it:

https://resource-management-9eqa.vercel.app

---
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

---

## User Roles and Capabilities

The Resource Management System implements three primary user roles. Each role has specific access and permissions within the system:

### Admin / Manager

- **Project Management:**
  - Can create new projects.
  - Can view, update, and delete any project.
  - Has full visibility of all projects—including client and team member details.
- **User Management (Admin-Only):**
  - Can view a list of all users.
  - Can update or delete user profiles.
- **Team Management:**
  - Can add or remove team members from any project.
- **Overall Control:**
  - Has the highest level of access to manage and oversee the entire system.

### Team Member

- **Project Access:**
  - Can view only the projects where they are assigned as a team member.
- **Project Updates:**
  - Can update project status and log hours for projects they are involved in.
- **Limited Management:**
  - Can see client details and other team member information within their assigned projects.
  - Cannot create or delete projects, or manage users.

### Client

- **Project Access:**
  - Can view projects where they are listed as the client.
- **Limited Visibility:**
  - Can see project details, including progress and team member information.
  - Does not have permissions to update project status, add team members, or manage users.

---

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


## Deployment

This project is deployed as two separate services:
###	•	Backend (Render):

The Express API (with Socket.IO) is deployed on Render.
URL: https://projectmanagementbackend-8utq.onrender.com

###	•	Frontend (Vercel):
The React app is deployed on Vercel.
URL: https://resource-management-9eqa.vercel.app
