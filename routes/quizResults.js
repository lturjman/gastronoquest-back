const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Quiz = require("../models/quizzes");
const { validateFields } = require("../middlewares/validateFields");

// Route pour récupérer les résultats aux quizz d'un utilisateur
router.get(
  "/",
  validateFields(["authorization"], "headers"),
  async (req, res) => {
    try {
      // Récupération du token et recherche de l'utilisateur en bdd
      const { authorization } = req.headers;
      const user = await User.findOne({ token: authorization });

      // Répondre une erreur si aucun utilisateur trouvé
      if (!user) {
        return res.status(400).json({ result: false, error: "user not found" });
      }

      console.log(user);
      // Envoi des résultats
      res.json({ result: true, data: user.quizResults });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "internal server error" });
    }
  }
);

// Route pour mettre à jour les résultats aux quizz après avoir terminé un quiz
router.put(
  "/",
  validateFields(["authorization"], "headers"),
  validateFields(["quizId", "score", "passed"], "body"),
  async (req, res) => {
    try {
      // Récupération du token et recherche de l'utilisateur en bdd
      const { authorization } = req.headers;
      const user = await User.findOne({ token: authorization });

      // Répondre une erreur si aucun utilisateur trouvé
      if (!user) {
        return res.status(400).json({ result: false, error: "user not found" });
      }

      // Vérification si le quizz existe bien en bdd
      const { quizId, score, passed } = req.body;
      const quiz = await Quiz.findById(quizId);

      if (!quiz) {
        return res.status(400).json({ result: false, error: "quiz not found" });
      }

      // Préparation des données pour la mise à jour
      const newQuizResult = {
        quiz: quiz._id,
        score,
        passed,
        passedAt: Date.now(),
      };
      console.log(newQuizResult);
      const newQuizResults = [...user.quizResults, newQuizResult];

      // Mise à jour des résultats de quizz
      const result = await User.updateOne(
        { token: authorization },
        { quizResults: newQuizResults }
      );

      if (result.modifiedCount === 1) {
        // Renvoie la nouvelle liste de résultats
        res.json({ result: true, data: newQuizResults });
      } else {
        // Erreur en cas d'échec de la mise à jour
        throw new Error("update failed");
      }

      // Envoi des résultats
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "internal server error" });
    }
  }
);

module.exports = router;
