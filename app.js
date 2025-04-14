require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const favoritesRouter = require("./routes/favorites");
const historyRouter = require("./routes/history");
const quizResultsRouter = require("./routes/quizResults");
const searchRouter = require("./routes/search");

var app = express();

const cors = require("cors");
app.use(cors());

require("./models/connection");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/favorites", favoritesRouter);
app.use("/history", historyRouter);
app.use("/quizResults", quizResultsRouter);
app.use("/search", searchRouter);

module.exports = app;
