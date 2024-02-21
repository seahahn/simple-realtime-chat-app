# ❇️ Simple Realtime Chat App

## 1️⃣ Project Introduction

Simple chat application with user authentication features.
The users can chat with other users when signed in and authenticated.

(Chat with AI feature is in progress.)

## 2️⃣ Features

### User Authentication

| Feature             | Route           |
| ------------------- | --------------- |
| Sign Up             | /signup         |
| Sign In             | /signin         |
| Sign Out            | /signout        |
| Reset Password      | /reset-password |
| User Profile Update | /profile        |
| User Account Delete | /profile        |

### Chatting

| Feature          | Route         |
| ---------------- | ------------- |
| Chat with People | /chat         |
| Chat with AI     | (In progress) |

## 3️⃣ Used Technologies

- Remix.run
- Tailwind CSS
- Prisma
- socket.io

## 4️⃣ Directory Structure

```bash
.
├── app
│   ├── components
│   │   └── ui // shadcn/ui components
│   ├── constants // globally used constants(e.g. envs, texts)
│   ├── lib // user auth, db connection, mail sender, socket connection and util functions
│   └── routes
├── prisma // includes prisma schema
└── socket // socket.io server
```

## 5️⃣ How to Run

### 1. Make a PostgreSQL database Docker container

```bash
docker run --name sailrs -e POSTGRES_USER=sailrs -e POSTGRES_PASSWORD=sailrs -p 5432:5432 -d postgres
```

### 2. Set .env file

```.env
NODE_ENV="development",

DATABASE_URL="postgresql://sailrs:sailrs@localhost:5432/sailrs"

USER_SESSION_KEY="userId"
SESSION_SECRET="secret"
HASH_SALT=7

EMAIL_HOST="smtp.gmail.com" // or else
EMAIL_HOST_USER="your-email@example.com"
EMAIL_HOST_PASSWORD="your-password"
EMAIL_PORT="465"
EMAIL_DEFAULT_FROM="your-email@example.com"

SOCKET_SERVER_URL="http://localhost:3500"
```

### 3. Apply Prisma Schema into the database

```bash
npx prisma db push
```

### 4. Run the App

```bash
# Main application
npm run dev

# Socket server (it should be executed another terminal from the Main application)
npm run dev:socket
```
