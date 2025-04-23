const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { validateFields } = require("../middlewares/validateFields");
const { calculateUserSavedCo2 } = require("../services/calculateUserSavedCo2");
const { calculateUserLevel } = require("../services/calculateUserLevel");

// GET /history : Récupérer l'historique des quêtes de l'utilisateur
router.get(
  "/",
  validateFields(["authorization"], "headers"),
  async (req, res) => {
    try {
      const token = req.headers.authorization;

      const user = await User.findOne({ token })
        .select("quests -_id")
        .populate([
          { path: "quests.restaurant", select: "name imageUrl -_id" },
          { path: "quests.achievedChallenges", select: "title savedCo2 -_id" },
        ]);

      // Réponse
      if (user.quests.length === 0) res.status(404).json({ result: false });
      else res.status(200).json({ result: true, data: user.quests });

    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Internal servor error" });
    }
  }
);

// POST /history : Mettre à jour l'historique après validation d'une quête
router.post(
  "/",
  validateFields(["authorization"], "headers"),
  validateFields(["restaurant", "achievedChallenges"], "body"),
  async (req, res) => {
    try {
      const token = req.headers.authorization;
      const { restaurant, achievedChallenges } = req.body;
      const quest = {
        restaurant,
        achievedChallenges,
        date: Date.now()
      };

      // Ajout de la quête à l'historique de l'utilisateur
      const response = await User.updateOne(
        { token },
        { $addToSet: { quests: quest } }
      );

      if (response.acknowledged) {
        // Récupération de l'historique de l'utilisateur
        const user = await User.findOne({ token })
          .select("quests -_id")
          .populate("quests.achievedChallenges", "title savedCo2 -_id");

        // Calcul de la somme du Co2 économisé lors de chaque quête
        const totalSavedCo2 = calculateUserSavedCo2(user.quests);
        const level = calculateUserLevel(totalSavedCo2);

        res.status(200).json({ result: true, totalSavedCo2, level });
      } else {
        res.status(500).json({ result: false, error: "Internal servor error" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Internal servor error" });
    }
  }
);

module.exports = router;