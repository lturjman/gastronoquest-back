const express = require("express");
const router = express.Router();
const Challenge = require("../models/challenges");
const Quiz = require("../models/quizzes");
const { validateFields } = require("../middlewares/validateFields");

// Route pour récupérer tous les défis
router.get("/challenges", async (req, res) => {
  try {
    const challenges = await Challenge.find().select("-__v");

    if (challenges.length > 0) res.status(200).json({ result: true, challenges });
    else res.status(500).json({ result: false, error: "Internal server error" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal server error" });
  }
});

// Route pour récupérer tous les quizz
router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions -__v");
    
    if (quizzes.length > 0) res.status(200).json({ result: true, quizzes });
    else res.status(500).json({ result: false, error: "Internal server error" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal server error" });
  }
});

// Route pour récupérer un quiz
router.get(
  "/quiz/:quizId",
  validateFields(["quizId"], "params"),
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const data = await Quiz.findById(quizId).select("-__v");

      if (data) res.status(200).json({ result: true, data });
      else res.status(500).json({ result: false, error: "Internal server error" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Internal server error" });
    }
  }
);

module.exports = router;