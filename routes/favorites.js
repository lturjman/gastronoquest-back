const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Restaurant = require("../models/restaurants");
const { validateFields } = require("../middlewares/validateFields");

// ROUTE POUR AJOUTER un restaurant aux favoris d'un utilisateur
router.post(
  "/",
  validateFields(["authorization"], "headers"),
  validateFields(["restaurantId"], "body"),
  async (req, res) => {
    try {
      const token = req.headers.authorization;
      const { restaurantId } = req.body;

      // Vérifier si l'utilisateur existe en comparant le token uid2
      const user = await User.findOne({ token });
      if (!user) return res.status(400).json({ result: false, message: "User not found" });

      // Vérifier si le restaurant existe
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) return res.status(400).json({ result: false, message: "Restaurant not found" });

      // Mettre à jour les favoris de l'utilisateur
      const response = await User.updateOne(
        { token },
        { $addToSet: { favorites: restaurantId } }
      );

      // Réponse
      if (response.acknowledged) res.status(200).json({ result: true });
      else res.status(500).json({ result: false, error: "Internal server error" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Internal server error" });
    }
  }
);

// ROUTE POUR SUPPRIMER un restaurant des favoris d’un user
router.delete(
  "/",
  validateFields(["authorization"], "headers"),
  validateFields(["restaurantId"], "body"),
  async (req, res) => {
    try {
      const token = req.headers.authorization;
      const { restaurantId } = req.body;

      // Vérifier si l'utilisateur existe en comparant le token uid2
      const user = await User.findOne({ token });
      if (!user) return res.status(400).json({ result: false, message: "User not found" });

      // Vérifier si le restaurant existe
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) return res.status(400).json({ result: false, message: "Restaurant not found" });

      // Mettre à jour les favoris de l'utilisateur
      const response = await User.updateOne(
        { token },
        { $pull: { favorites: restaurantId } }
      );

      // Réponse
      if (response.acknowledged) res.status(200).json({ result: true });
      else res.status(500).json({ result: false, error: "Internal server error" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Internal server error" });
    }
});

module.exports = router;