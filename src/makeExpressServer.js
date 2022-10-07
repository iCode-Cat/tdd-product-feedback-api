const express = require("express");
const app = express();
const cors = require("cors");
const {services} = require("./main");
// const makeDB = require("./makeDB");

async () => await makeDB;
console.log("done");

const PORT = process.env.PORT || 8080;
// Settings
app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));

// Routes
app.get("/api/health", (req, res) => {
  return res.status(200).send({message: "app is running"});
});

app.use("/", require("./routes/user")({config: process.env, services}));
app.use("/", require("./routes/feedback")({config: process.env, services}));

// Server Start
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = server;
