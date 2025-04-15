const express = require("express");
const router = express.Router();

const User = require("../models/users");
const Restaurant = require("../models/restaurants");

// ROUTE POUR AJOUTER un restaurant aux favoris d'un utilisateur
router.post("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Récupère le token UID2 depuis le header Authorization.split(' ') transforme string en tableau  & [1]récupère juste le token
  const { restaurantId } = req.body;

  if (!token) {
    return res.status(400).json({ result: false, message: "Missing token" });
  }

  try {
    // Vérifier si l'utilisateur existe en comparant le token
    const user = await User.findOne({ token }); // Ici, on cherche un utilisateur avec ce token
    if (!user) {
      return res.status(400).json({ result: false, message: "User not found" });
    }

    // Vérifier si le restaurant existe
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res
        .status(400)
        .json({ result: false, message: "Restaurant not found" });
    }

    // Mettre à jour les favoris de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { favorites: restaurantId } }, // Ajoute le restaurant aux favoris si ce n'est pas déjà fait
      { new: true } //renvoi le document à jour
    );
    à;
    res.json({ result: true, user: updatedUser });
  } catch (err) {
    return res
      .status(500)
      .json({ result: false, message: "Server error", error: err });
  }
});

// ROUTE POUR SUPPRIMER un restaurant des favoris d’un user
router.delete("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { restaurantId } = req.body;

  if (!token) {
    return res.status(400).json({ result: false, message: "Missing token" });
  }

  try {
    // Vérifier si l'utilisateur existe en comparant le token
    const user = await User.findOne({ token }); // Recherche l'utilisateur avec ce token UID2
    if (!user) {
      return res.status(400).json({ result: false, message: "User not found" });
    }

    // Vérifier si le restaurant existe
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res
        .status(400)
        .json({ result: false, message: "Restaurant not found" });
    }

    // Supprimer le restaurant des favoris de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { favorites: restaurantId } }, // Utiliser $pull pour retirer le restaurant des favoris
      { new: true }
    );

    res.json({ result: true, user: updatedUser }); // Retourner l'utilisateur mis à jour avec ses nouveaux favoris
  } catch (error) {
    return res
      .status(500)
      .json({ result: false, message: "Server error", error });
  }
});

module.exports = router;
