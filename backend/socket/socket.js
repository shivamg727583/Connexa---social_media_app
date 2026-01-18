const { Server } = require("socket.io");

const userSocketMap = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: (origin, cb) => {
        if (!origin || origin === process.env.FRONTEND_URL) {
          cb(null, true);
        } else {
          cb(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  
  io.use((socket, next) => {
    const { userId } = socket.handshake.query;

    if (!userId || userId === "undefined") {
      return next(new Error("Unauthorized socket connection"));
    }

    socket.userId = userId; 
    next();
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

   
    userSocketMap.set(userId, socket.id);
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

   
    socket.on("typing", ({ receiverId, isTyping }) => {
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", {
          userId,
          isTyping,
        });
      }
    });

   
    socket.on("joinGroup", (groupId) => {
      if (groupId) socket.join(groupId);
    });

    socket.on("leaveGroup", (groupId) => {
      if (groupId) socket.leave(groupId);
    });

    socket.on("groupTyping", ({ groupId, isTyping }) => {
      if (groupId) {
        socket.to(groupId).emit("groupTyping", {
          userId,
          groupId,
          isTyping,
        });
      }
    });


    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
      io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });
  });

  const getReceiverSocketId = (userId) => {
    return userSocketMap.get(userId);
  };

  return { io, getReceiverSocketId };
};

module.exports = initSocket;
