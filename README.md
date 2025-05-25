# TODO App

A full stack TODO application with Node.js, Express, MongoDB backend and React, Material UI frontend. Uses pnpm for package management.

## Features

- Add tasks
- Delete tasks
- Search tasks

## Backend

- Node.js, Express, MongoDB
- API endpoints:
  - `POST /api/tasks` - Add a new task
  - `DELETE /api/tasks/:id` - Delete a task
  - `GET /api/tasks?q=search` - Search tasks

## Frontend

- React, Material UI
- Connects to backend API

## Getting Started

### Backend

1. Make sure MongoDB is running on `localhost:27017`.
2. Install dependencies:
   ```powershell
   pnpm install
   ```
3. Start the server:
   ```powershell
   node server.js
   ```

### Frontend

1. (To be created) in `/client` folder.

## Tests

- (To be added) Complete test code for backend and frontend.
