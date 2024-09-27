# Bookie Application Backend API

This project is the backend for a book application where users can read books, leave comments, become authors, and perform basic CRUD operations as both readers and authors. The API is built using NestJS and provides endpoints for managing books, comments, and user profiles.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Directory Structure](#directory-structure)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with this project, follow the instructions below to set up your local development environment.

## Features

- **User Management**: Users can sign up, log in, and manage their profiles.
- **Read Books**: Users can browse and read a wide selection of books.
- **Commenting**: Users can leave comments on books to share their thoughts and insights.
- **Authoring**: Users can become authors and manage their own books.
- **CRUD Operations**: Basic Create, Read, Update, and Delete operations for books and comments.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **MongoDB**: A NoSQL database for storing book and user data.
- **Mongoose**: A MongoDB object modeling tool for Node.js.
- **JWT**: JSON Web Token for user authentication.

## API Endpoints

### Authentication

- **POST /auth/signup**: Register a new user.
- **POST /auth/login**: Authenticate a user and return a JWT.

### Users

- **GET /users**: Retrieve a list of all users.
- **GET /users/:id**: Retrieve a specific user by ID.
- **PUT /users/:id**: Update a user's profile.
- **DELETE /users/:id**: Delete a user account.

### Books

- **GET /books**: Retrieve a list of all books.
- **GET /books/:id**: Retrieve a specific book by ID.
- **POST /books**: Create a new book (author only).
- **PUT /books/:id**: Update a book (author only).
- **DELETE /books/:id**: Delete a book (author only).

### Comments

- **GET /books/:id/comments**: Retrieve comments for a specific book.
- **POST /books/:id/comments**: Add a comment to a specific book.
- **DELETE /comments/:id**: Delete a specific comment.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

To start the development server, run:

```bash
npm run start:dev
```

You can then access the API at `http://localhost:3000`.

## Scripts

- **build**: Builds the application for production.
- **start**: Starts the application in production mode.
- **start:dev**: Starts the application in development mode with auto-reload.
- **lint**: Runs ESLint to check for code quality issues.
- **test**: Runs tests for the application.

## Directory Structure

```plaintext
api/
├── src/                    # Source code
│   ├── auth/               # Authentication module
│   ├── users/              # User management module
│   ├── books/              # Books management module
│   ├── comments/           # Comments management module
│   ├── app.module.ts       # Main application module
│   ├── main.ts             # Entry point of the application
├── package.json            # Project metadata and dependencies
└── tsconfig.json           # TypeScript configuration
```
