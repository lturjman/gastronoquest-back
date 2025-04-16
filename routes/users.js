const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { validateFields } = require("../middlewares/validateFields");
const { calculateUserLevel } = require("../services/calculateUserLevel");
const { calculateUserCo2Saved } = require("../services/calculateUserCo2Saved");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// Inscription
// Utilisation d'un middleware pour vérifier les champs nécessaires
router.post(
  "/register",
  validateFields(["username", "email", "password"], "body"),
  async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const result = await User.findOne({ email });
      if (result) {
        return res
          .status(400)
          .json({ result: false, error: "email already used" });
      }

      // Création du token utilisateur et hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = uid2(32);

      // Ajout de l'utilisateur en bdd
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        token,
        favorites: [],
        quests: [],
        quizResults: [],
      });

      await newUser.save();

      // Préparation des éléments à retourner pour insertion dans le store redux côté front
      const data = {
        firstConnection: true,
        username,
        email,
        token,
        level: "jeune pousse",
        totalSavedCo2: 0,
        favorites: [],
      };

      res.status(201).json({ result: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "internal server error" });
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

      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ email }).populate(
        "quests.achievedChallenges"
      );
      if (!user) {
        return res.status(400).json({ result: false, error: "user not found" });
      }

      // Comparaison du mot de passe
      const isCorrectPassword = await bcrypt.compare(password, user.password);

      if (!isCorrectPassword) {
        return res
          .status(401)
          .json({ result: false, error: "invalid password" });
      }

      // Récupération des informations de l'utilisateur
      // Calcul du niveau de l'utilisateur et du CO2 économisé
      const { username, token, favorites, quizResults, quests } = user;
      const level = calculateUserLevel(quizResults);
      const totalSavedCo2 = calculateUserCo2Saved(quests);

      // Préparation des données à retourner
      const data = {
        firstConnection: false,
        username,
        email,
        token,
        level,
        totalSavedCo2,
        favorites,
      };

      res.json({ result: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "internal server error" });
    }
  }
);

module.exports = router;
