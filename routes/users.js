const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const { validateFields } = require("../middlewares/validateFields");
const { calculateUserLevel } = require("../services/calculateUserLevel");
const { calculateUserSavedCo2 } = require("../services/calculateUserSavedCo2");

// Inscription
// Utilisation d'un middleware pour vérifier les champs nécessaires
router.post(
  "/register",
  validateFields(["username", "email", "password", "guest"], "body"),
  async (req, res) => {
    try {
      const { username, email, password, guest } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const result = await User.findOne({ email });
      if (result)
        return res
          .status(400)
          .json({ result: false, error: "Email already used" });

      // Création du token utilisateur et hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = uid2(32);

      // Ajout de l'utilisateur en BDD
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        token,
        favorites: guest.favorite !== null ? [guest.favorite] : [],
        quests: guest.quest !== null ? [guest.quest] : [],
        quizResults: guest.quiz !== null ? [guest.quiz] : [],
      });
      await newUser.save();

      // Récupération des informations de l'utilisateur
      const user = await User.findOne({ token })
        .populate("quests.achievedChallenges favorites")
        .lean(); // ajout d'un lean pour transformer la réponse en obj javascript et éviter une révocation de proxy (qui peut arriver avec populate)
      const { favorites, quests } = user;

      // Calcul du niveau de l'utilisateur et du CO2 économisé
      const totalSavedCo2 =
        quests && quests.length > 0 ? calculateUserSavedCo2(quests) : 0;
      const level = calculateUserLevel(totalSavedCo2);

      // Préparation des éléments à retourner pour insertion dans le store Redux
      const data = {
        firstConnection: true,
        username,
        email,
        token,
        level,
        totalSavedCo2,
        favorites,
      };

      res.status(201).json({ result: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Internal server error" });
    }
  }
);

// Connexion
// Utilisation d'un middleware pour vérifier les champs nécessaires
router.post(
  "/login",
  validateFields(["email", "password"], "body"),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const user = await User.findOne({ email }).populate(
        "quests.achievedChallenges favorites"
      );
      if (!user)
        return res.status(400).json({ result: false, error: "User not found" });

      // Comparaison du mot de passe
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword)
        return res
          .status(401)
          .json({ result: false, error: "Invalid password" });

      // Récupération des informations de l'utilisateur
      const { username, token, favorites, quests } = user;

      // Calcul du niveau de l'utilisateur et du CO2 économisé uniquement s'il y a des quêtes
      const totalSavedCo2 =
        quests && quests.length > 0 ? calculateUserSavedCo2(quests) : 0;
      const level = calculateUserLevel(totalSavedCo2);

      // Préparation des éléments à retourner pour insertion dans le store Redux
      const data = {
        firstConnection: false,
        username,
        email,
        token,
        level,
        totalSavedCo2,
        favorites,
      };

      res.status(200).json({ result: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Internal server error" });
    }
  }
);

module.exports = router;
