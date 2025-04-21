const express = require("express");
const router = express.Router();
require("../models/connection");
const { validateFields } = require("../middlewares/validateFields");

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

// Route GET pour récupérer un quiz
router.get(
  "/quiz/:quizId",
  validateFields(["quizId"], "params"),
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const data = await Quiz.findById(quizId);
      res.json({ result: true, data });
    } catch (error) {
      res.status(500).json({
        result: false,
        message: "Error retrieving quiz",
        error,
      });
    }
  }
);

module.exports = router;
