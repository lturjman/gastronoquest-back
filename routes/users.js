const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { validateFields } = require("../middlewares/validateFields");
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
        level: "Jeune pousse",
        totalSavedCo2: 0,
        favorites: [],
      };

      res.status(201).json({ result: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "internal servor error" });
    }
  }
);

module.exports = router;
