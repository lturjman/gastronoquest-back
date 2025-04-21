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

      // Mettre à jour le quizz s'il existe déjà
      // Utilisation de equals pour comparer des objects ID MongoDB
      const quizResultsFiltered = user.quizResults.filter((quizResult) =>
        quizResult.quiz.equals(quiz._id)
      );

      // Le quizz existe déjà mais le score est moins élevé -> on ne fait rien
      if (quizResultsFiltered.length && quizResultsFiltered[0].score >= score) {
        return res.json({ result: true, data: quizResultsFiltered[0] });
      }

      // Dans les deux autres cas on va devoir ajouter un nouveau résultat en bdd, soit en écrasant soit en ajoutant
      // Préparation du nouveau résultat
      const newQuizResult = {
        quiz: quiz._id,
        score,
        passed,
        passedAt: Date.now(),
      };

      let newQuizResults;

      // Le quizz existe et le score est plus élevé -> on met à jour les résultats
      if (quizResultsFiltered.length && quizResultsFiltered[0].score < score) {
        // Création d'une copie en enlevant le résultat
        const quizResultsCopy = user.quizResults.filter(
          (quizResult) => !quizResult.quiz.equals(quiz._id)
        );

        // Ajout du nouveau résultat à la copie
        newQuizResults = [...quizResultsCopy, newQuizResult];
      } else {
        // Si le quiz n'existe pas, on ajoute simplement le nouveau résultat
        newQuizResults = [...user.quizResults, newQuizResult];
      }

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
