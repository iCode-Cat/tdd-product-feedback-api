const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const {services} = require("./main");
const {socketIO} = require("./services/commentSocket");
const {isNullOrUndefined} = require("util");
const http = require("http").Server(app);
const io = require("socket.io")(http);
socketIO(io);

const PORT = process.env.PORT || 8080;
// Settings
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));

// Routes
app.get("/api/health", (req, res) => {
  return res.status(200).send({message: "app is running"});
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.use("/", require("./routes/user")({config: process.env, services}));
app.use("/", require("./routes/feedback")({config: process.env, services}));

// Server Start
const server = http
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", err => {
    console.log(err);
    // Graceful shutdown
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  });

module.exports = server;
