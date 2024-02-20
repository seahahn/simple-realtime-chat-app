# App for Sailrs

## Features

### User Authentication

- Sign Up
- Sign In
- Sign Out
- Reset Password
- User Profile Update
- User Account Delete

### Chatting

- Chat with People
- Chat with AI (In progress)

## How to Run

### Make a PostgreSQL database Docker container

```bash
docker run --name sailrs -e POSTGRES_USER=sailrs -e POSTGRES_PASSWORD=sailrs -p 5432:5432 -d postgres
```

### Set .env file

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

### Apply Prisma Schema into the database

```bash
npx prisma db push
```

### Run the App

```bash
# Main application
npm run dev

# Socket server (it should be executed another terminal from the Main application)
npm run dev:socket
```
