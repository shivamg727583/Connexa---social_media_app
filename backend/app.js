const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { generalLimiter } = require("./middlewares/rateLimiter");

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  undefined
];

const corsOptions = {
  origin: (origin, cb) => {
    if (allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};



app.use(cors(corsOptions));


app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy blocked this request",
    });
  }
  next(err);
});



app.use("/health", (req, res, next) => next());

app.use(generalLimiter);
app.use(helmet());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/user", require("./routes/user.route"));
app.use("/api/friends", require("./routes/friend.routes"));
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/groups", require("./routes/group.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));


app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

module.exports = app;
