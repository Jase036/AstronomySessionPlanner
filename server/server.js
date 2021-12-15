"use strict";

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { getWeather } = require("./getWeather")
const { getAstro } = require("./getAstro")
const { getSchedule } = require("./getSchedule");
const { addPlan } = require("./addPlan");
const { handleUser } = require("./handleUser");
const { editPlan } = require("./editPlan");

const PORT = 8000;
const app = express();
// express()

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, HEAD, GET, PUT, POST, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(morgan("tiny"));
app.use(express.static("./server/assets"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(__dirname + "/"));

// endpoints

// gets our weather forecast data
app.get('/forecast/', getWeather)

// gets our astro catalog data
app.get('/astro/', getAstro)

// gets our astro plan data
app.get('/plan/:email', getSchedule)

// post to create selected astro plan
app.post('/add-plan/', addPlan)

// checks to see if user is in database, if not creates an entry
app.post('/user/', handleUser)

// modify or delete plan in user's document
app.post('/edit-plan/', editPlan)

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
