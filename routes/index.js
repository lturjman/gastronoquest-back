const express = require("express");
const router = express.Router();
require("../models/connection");

// CHALLENGES
const Challenge = require("../models/challenges");

// Route GET pour récupérer tous les challenges
router.get("/challenges", async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json({ result: true, challenges });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: "Error retrieving challenges",
      error,
    });
  }
});

// QUIZ
const Quiz = require("../models/quizzes");

// Route GET pour récupérer tous les quiz
router.get("/quiz", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json({ result: true, quizzes });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: "Error retrieving quizzes",
      error,
    });
  }
});

module.exports = router;
