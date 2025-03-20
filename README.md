# Chat Application

## Overview
The Chat Application is a real-time messaging platform built using the MERN (MongoDB, Express.js, React, Node.js) stack with WebSocket integration. It enables users to send and receive messages instantly, fostering seamless communication.

## Features
- **User Authentication**: Secure login and registration using JWT and cookies.
- **Real-time Messaging**: Instant message delivery using WebSockets (Socket.io).
- **Group Chats**: Users can create and participate in group conversations.
- **Media Sharing**: Supports sharing images and files.
- **Profile Management**: Users can update profile pictures and bio.
- **Dark Mode**: Optional theme selection for better user experience.

## Tech Stack
- **Frontend**: React.js, Zustand, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Real-time Communication**: Socket.io
- **Authentication**: JWT-based authentication with cookies
- **Storage**: Cloudinary (for media storage)

## Installation
### Prerequisites
- Node.js installed
- MongoDB instance running (local or cloud)

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/chat-app.git
   cd chat-app
   ```

2. Install dependencies:
   ```sh
   npm install
   cd client && npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_URL=your_cloudinary_url
   ```

4. Start the backend server:
   ```sh
   npm run server
   ```

5. Start the frontend:
   ```sh
   cd client
   npm start
   ```

## Usage
- Register an account and log in.
- Start a new chat with a user or create a group chat.
- Send text messages, images, and files in real time.
- View online status.

## Future Enhancements
- End-to-end encryption for secure communication.
- Voice and video calling features.
- AI-based chat suggestions.

## Contact
For queries, reach out at [your-videshravi27@gmail.com](mailto:videshravi27.com)
