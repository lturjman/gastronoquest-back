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
      const { authorization } = req.headers;
      const { restaurantId } = req.body;

      // Vérifier si l'utilisateur existe en comparant le token uid2
      const user = await User.findOne({ token: authorization });
      if (!user) {
        return res
          .status(400)
          .json({ result: false, message: "User not found" });
      }

      // Vérifier si le restaurant existe
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res
          .status(400)
          .json({ result: false, message: "Restaurant not found" });
      }

      // Mettre à jour les favoris de l'utilisateur
      const response = await User.updateOne(
        { token : authorization },
        { $addToSet: { favorites: restaurantId } }
      );

      // Réponse
      if (response.acknowledged) {
        res.status(200).json({ result: true });
      }

      /*
      await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { favorites: restaurantId } }, // Ajoute le restaurant aux favoris s'il n'est pas déjà présent
        { new: true } // Renvoie le document à jour
      )
      .populate("favorites")
      .select("favorites -_id")
      .exec();
      console.log("test:", test);

      const updatedUser = await User.findById(user._id).populate("favorites");
      //console.log("updated:", updatedUser);

      res.json({ result: true, user: updatedUser });
      */

    } catch (error) {

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
      const { authorization } = req.headers;
      const { restaurantId } = req.body;

      // Vérifier si l'utilisateur existe en comparant le token uid2
      const user = await User.findOne({ token: authorization });
      if (!user) {
        return res.status(400).json({ result: false, message: "User not found" });
      }

      // Vérifier si le restaurant existe
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(400).json({ result: false, message: "Restaurant not found" });
      }

      // Mettre à jour les favoris de l'utilisateur
      const response = await User.updateOne(
        { token : authorization },
        { $pull: { favorites: restaurantId } }
      );

      // Réponse
      if (response.acknowledged) {
        res.status(200).json({ result: true });
      }

      /*
      // Filtrer les favoris pour exclure le restaurant à supprimer
      const updatedFavorites = user.favorites.filter(
        (fav) => fav._id.toString() !== restaurantId
      );

      // Mettre à jour les favoris de l'utilisateur
      user.favorites = updatedFavorites;
      await user.save();

      res.json({ result: true, user: user }); // Retourner l'utilisateur mis à jour avec ses nouveaux favoris
      */
    } catch (error) {

    }
});

module.exports = router;
