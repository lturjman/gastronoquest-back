const express = require("express");
const router = express.Router();
const { validateFields } = require("../middlewares/validateFields");

const User = require("../models/users");
const Restaurant = require("../models/restaurants");

// ROUTE POUR OBTENIR les restaurants favoris d'un utilisateur
// router.get(
//   "/",
//   validateFields(["authorization"], "headers"),
//   async (req, res) => {
//     const { authorization } = req.headers; // Récupère le token UID2 depuis le header Authorization

//     // Vérifier si l'utilisateur existe en comparant le token
//     const user = await User.findOne({ token: authorization }); // Ici, on cherche un utilisateur avec ce token
//     if (!user) {
//       return res.status(400).json({ result: false, message: "User not found" });
//     }

//     // Récupérer les restaurants favoris de l'utilisateur
//     const favorites = await Restaurant.find({
//       _id: { $in: user.favorites },
//     });

//     res.json({ result: true, favorites });
//   }
// );

// ROUTE POUR AJOUTER un restaurant aux favoris d'un utilisateur
router.post(
  "/",
  validateFields(["authorization"], "headers"),
  async (req, res) => {
    const { authorization } = req.headers; // Récupère le token UID2 depuis le header Authorization
    const { restaurantId } = req.body;

    // Vérifier si l'utilisateur existe en comparant le token
    const user = await User.findOne({ token: authorization }); // Ici, on cherche un utilisateur avec ce token
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
    await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { favorites: restaurantId } }, // Ajoute le restaurant aux favoris si ce n'est pas déjà fait
      { new: true }.populate("favorites") //renvoi le document à jour
    );
    const updatedUser = await User.findById(user._id).populate("favorites");

    res.json({ result: true, user: updatedUser });
  }
);

// ROUTE POUR SUPPRIMER un restaurant des favoris d’un user
router.delete("/", async (req, res) => {
  const { authorization } = req.headers;
  const { restaurantId } = req.body;

  // Vérifier si l'utilisateur existe en comparant le token
  const user = await User.findOne({ token: authorization }); // Recherche l'utilisateur avec ce token UID2
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

  // Filtrer les favoris pour exclure le restaurant à supprimer
  const updatedFavorites = user.favorites.filter(
    (fav) => fav._id.toString() !== restaurantId
  );

  // Mettre à jour les favoris de l'utilisateur
  user.favorites = updatedFavorites;
  await user.save();

  res.json({ result: true, user: user }); // Retourner l'utilisateur mis à jour avec ses nouveaux favoris
});

// Supprimer le restaurant des favoris de l'utilisateur
// const updatedUser = await User.findByIdAndUpdate(
//   user._id,
//   { $pull: { favorites: restaurantId } }, // Utiliser $pull pour retirer le restaurant des favoris
//   { new: true }
// );

// res.json({ result: true, user: updatedUser }); // Retourner l'utilisateur mis à jour avec ses nouveaux favoris
// });

module.exports = router;
