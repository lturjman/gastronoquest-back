const express = require("express");
const router = express.Router();

const User = require("../models/users");
const Restaurant = require("../models/restaurants");

// Ajouter un restaurant aux favoris d'un utilisateur
router.post("/favorites", async (req, res) => {
  const { userId, restaurantId } = req.body;

  try {
    // Vérifier si le resto existe
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res
        .status(400)
        .json({ success: false, message: "Restaurant non trouvé" });
    }

    // Mettre à jour les favoris du userconst user = await User.findById(userId);
    const user = await User.findById(userId);
    if (!user.favorites.includes(restaurantId)) {
      user.favorites.push(restaurantId);
      await user.save();
    }

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error });
  }
});

module.exports = router;
