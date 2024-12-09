# User Authentication and Role-Based Access Control System

A robust backend system built with Node.js, Express.js, and MongoDB to handle user authentication and role-based access control. This project provides secure access to resources and efficiently manages user roles such as Admin, Manager, and User.

## Features

- **User Authentication**: 
  - Sign-up, login, and logout functionalities.
  - Token-based sessions using JSON Web Tokens (JWT) for secure access.
- **Role-Based Authorization**:
  - Restricts access to specific resources based on user roles.
  - Supports customizable roles (e.g., Admin, Manager, User).
- **Database Integration**:
  - MongoDB for efficient and scalable data storage.
- **Secure Coding Practices**:
  - Password encryption using bcrypt for enhanced security.
  - Input validation to prevent common vulnerabilities (e.g., SQL injection, XSS).
- **RESTful APIs**:
  - Structured, scalable endpoints for seamless integration with frontend applications.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Validation**: Express-validator
- **Version Control**: Git, GitHub

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/username/repo-name.git
   cd repo-name
2. Install dependencies:
   ```bash
   npm install
3. Create a .env file in the root directory and configure the following:
   ```bash
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbName>
   JWT_SECRET=your_jwt_secret
4. Start the server:
    ```bash
   npm start

