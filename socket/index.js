import express from "express";
import {Server} from "socket.io";

const PORT = process.env.PORT || 3500;

const app = express();

const expressServer = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const UsersState = {
  users: [],
  setUsers: function (newUsersArray) {
    this.users = newUsersArray;
  },
};

const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:3000", "http://127.0.0.1:3000"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Upon connection - only to user
  socket.emit("message", {message: "Welcome to Chat App!", fromServer: true});

  // Upon connection - to all others
  // @param data {userId: string, nickname: string}
  socket.on("join", (data) => {
    socket.broadcast.emit("message", {
      message: `User ${data.nickname} has joined the chat`,
      fromServer: true,
    });

    activateUser(socket.id, data.userId, data.nickname);
    io.emit("participant", UsersState.users);
  });

  // Listening for a message event
  // @param data {userId: string, nickname: string, message: string}
  socket.on("message", (data) => {
    io.emit("message", data);
  });

  // When user disconnects - to all others
  socket.on("disconnect", () => {
    const user = getUserBySocketId(socket.id);

    socket.broadcast.emit("message", {
      message: `User ${user.nickname} has left the chat`,
      fromServer: true,
    });

    deactivateUser(user.userId);
    io.emit("participant", UsersState.users);
  });
});

// User functions
function activateUser(socketId, userId, nickname) {
  const user = {socketId, userId, nickname};
  UsersState.setUsers([...UsersState.users.filter((user) => user.userId !== userId), user]);
  return user;
}

function deactivateUser(userId) {
  UsersState.setUsers(UsersState.users.filter((user) => user.userId !== userId));
}

function getUserBySocketId(socketId) {
  return UsersState.users.find((user) => user.socketId === socketId);
}
