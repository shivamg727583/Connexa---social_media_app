const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || origin === process.env.FRONTEND_URL) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json());

app.use("/api/user", require("./routes/user.route"));
app.use("/api/friends", require("./routes/friend.routes"));
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));

module.exports = app;
