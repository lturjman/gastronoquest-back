const express = require('express');
const router = express.Router();

const User = require('../models/users');
const { calculateUserCo2Saved } = require("../services/calculateUserCo2Saved");


// GET /history : Récupérer l'historique des quêtes de l'utilisateur (pour HistoryScreen)

router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ token })
    .select('quests -_id')
    .populate([
      { path: 'quests.restaurant', select: 'name imageUrl -_id' },
      { path: 'quests.achievedChallenges', select: 'title savedCo2 -_id' }
    ]);
  
    if (user.quests.length === 0) {
      res.status(200).json({ result: false });
    } else {
      res.status(200).json({ result: true, data: user.quests });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal servor error" });
  }
});


// POST /history : Mettre à jour l'historique après validation d'une quête (pour RestaurantScreen)

router.post('/', async (req, res) => {
  try {
    const { token, restaurant, achievedChallenges } = req.body;
    const quest = { restaurant, achievedChallenges, date: new Date() };

    // Ajout de la quête à l'historique de l'utilisateur
    const response = await User.updateOne({ token }, { $addToSet: { quests: quest } });
    
    if (response.acknowledged) {
      // Récupération de l'historique de l'utilisateur
      const user = await User.findOne({ token })
      .select('quests -_id')
      .populate('quests.achievedChallenges', 'title savedCo2 -_id');

      // Calcul de la somme du Co2 économisé lors de chaque quête
      const totalSavedCo2 = calculateUserCo2Saved(user.quests);

      res.status(200).json({ result: true, totalSavedCo2 });
    } else {
      res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal servor error" });
  }
});


module.exports = router;