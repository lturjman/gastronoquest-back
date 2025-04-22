const express = require("express");
const router = express.Router();
const Challenge = require("../models/challenges");
const Quiz = require("../models/quizzes");
const { validateFields } = require("../middlewares/validateFields");

// Route GET pour récupérer tous les challenges
router.get("/challenges", async (req, res) => {
  try {
    const challenges = await Challenge.find().select("-__v");

    if (challenges.length > 0) res.status(200).json({ result: true, challenges });
    else res.status(404).json({ result: false });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Error retrieving challenges" });
  }
});

// Route GET pour récupérer tous les quizz
router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions -__v");
    
    if (quizzes.length > 0) res.status(200).json({ result: true, quizzes });
    else res.status(404).json({ result: false });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Error retrieving quizzes" });
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

      if (data) res.status(200).json({ result: true, data });
      else res.status(404).json({ result: false });

    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Error retrieving quiz" });
    }
  }
);

module.exports = router;