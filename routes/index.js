const express = require("express");
const router = express.Router();
const Challenge = require("../models/challenges");
const Quiz = require("../models/quizzes");
const { validateFields } = require("../middlewares/validateFields");

// Route GET pour récupérer tous les challenges
router.get("/challenges", async (req, res) => {
  try {
    const challenges = await Challenge.find().select("-__v");
    res.json({ result: true, challenges });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: "Error retrieving challenges",
      error,
    });
  }
});

// Route GET pour récupérer tous les quizz
router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions -__v");
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
      const data = await Quiz.findById(quizId).select("-__v");
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
