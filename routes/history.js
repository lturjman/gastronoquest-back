const express = require('express');
const router = express.Router();

const User = require('../models/users');
const Restaurant = require('../models/restaurants');

// GET /history : Récupérer l'historique des quêtes de l'utilisateur (pour HistoryScreen)

router.get('/:token', async (req, res) => {
  const { token } = req.params;
  const history = await User.findOne({ token })
    .select('quests -_id')
    .populate('quests.restaurant', 'name imageUrl -_id');
/* Il faudra faire pareil pour les achievedChallenges quand j'aurai des données
Et voir si je peux enlever l'id des objets de quests
Marche :
.populate({
  path: 'quests',
  populate: { path: 'restaurant' }
});
// Ne marche pas : .populate('quests', 'restaurant');
*/

  res.json({ history: history.quests });
});

/*
// POST /history : Mettre à jour l'historique après validation d'une quête (pour RestaurantScreen)
Req.body = token, id du restaurant, id des défis validés, date de validation
Res = result
*/

router.post('/', async (req, res) => {
  const { token, restaurant, achievedChallenges } = req.body; // need to add date
  const date = new Date(); // pour les tests uniquement
  const quest = { restaurant, achievedChallenges, date };
  await User.updateOne({ token }, { $addToSet: { quests: quest } });
  const user = await User.findOne({ token }).select('quests -_id'); // pour les tests uniquement
  res.json(user); // pour les tests uniquement
});


module.exports = router;