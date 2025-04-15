const express = require('express');
const router = express.Router();
const geolib = require('geolib');

const Restaurant = require('../models/restaurants');



/*
### Routes pour afficher les restaurants trouvés en fonction des différents filtres de recherche et du "niveau de zoom" de la carte
- Route de recherche d'un restaurant par son nom
- Route de recherche d'un restaurant par ses coordonnées
Récupérer ce qu'on a fait sur autocomplete pour ça

*/






// Peut-être que ce sera plus intelligent de tout regrouper dans une seule route et de rajouter une valeur dans req.body pour savoir de quel type de recherche il s'agit

// POST /search/restaurant : chercher un restaurant par son nom (name) et les filtres de recherche
// Recherche insensible à la casse
// Pattern qui recherche un morceau de l'input et pas au complet, voir si on veut changer ça pour au moins des mots complets ou mettre un nombre minimal de caractères

// Première implémentation des filtres, à faire sur les autres routes
// J'ai mis $in mais voir si on veut plutôt mettre $all

router.post('/restaurant', async (req, res) => {
  const { name, priceRange, badges, types } = req.body;
  const query = {};
  if (name) query.name = { $regex: new RegExp(name, "i") };
  if (priceRange) query.priceRange = priceRange;
  if (badges) query.badges = { $in: badges };
  if (types) query.types = { $in: types };
  console.log(query); //
  const restaurants = await Restaurant.find(query).select("-_id -__v");
  res.json({ restaurants }); // Probablement faire des result
});

/* Première version sans les filtres
router.post('/restaurant', async (req, res) => {
  const { input } = req.body;
  const pattern = new RegExp(input, "i");
  const restaurants = await Restaurant.find({ name: { $regex: pattern } }).select("-_id -__v");
  res.json({ restaurants }); // Probablement faire des result
});
*/



// POST /search/address : chercher un restaurant par son adresse (name)
// Voir si on veut limiter au code postal ou au nom de la ville (ou même si on veut utiliser cette option tout court)

router.post('/address', async (req, res) => {
  const { input } = req.body;
  const pattern = new RegExp(input, "i");
  const restaurants = await Restaurant.find({ address: { $regex: pattern } }).select("-_id -__v");
  res.json({ restaurants });
});


// POST /search/city : chercher un restaurant par sa ville (coordinates)

router.post('/city', async (req, res) => {
  const { input, distance } = req.body;
  const radius = parseInt(distance) * 1000;

  // Requête au webservice
  const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${input}`);
  const data = await response.json();
  const city = data.features[0];
  const center = {
    latitude: city.geometry.coordinates[1],
    longitude: city.geometry.coordinates[0],
  };

  // Récupération de tous les restaurants
  const allRestaurants = await Restaurant.find();

  // Récupération des restaurants dans le radius
  const restaurants = allRestaurants.filter(restaurant => 
    geolib.isPointWithinRadius(
      { latitude: restaurant.coordinates.latitude,
        longitude: restaurant.coordinates.longitude
      }, // coordonnées du restaurant
      center, // coordonnées du point de référence
      radius // distance maximale en mètres
    ) === true
  );

  res.json({ restaurants });
});


// POST /search/geolocalisation : chercher un restaurant en fonction de la géolocalisation de l'utilisateur (coordinates)

router.post('/geolocalisation', async (req, res) => {
  const { geolocalisation, distance } = req.body;
  const radius = parseInt(distance) * 1000;

  // Récupération de tous les restaurants
  const allRestaurants = await Restaurant.find();

  // Récupération des restaurants dans le radius
  const restaurants = allRestaurants.filter(restaurant => 
    geolib.isPointWithinRadius(
      { latitude: restaurant.coordinates.latitude,
        longitude: restaurant.coordinates.longitude
      }, // coordonnées du restaurant
      geolocalisation, // coordonnées du point de référence
      radius // distance maximale en mètres
    ) === true
  );

  res.json({ restaurants });
});





/* NOTES POUR EVENTUELLE CONVERSION EN AGGREGATION

Restaurant.aggregate( [
  { $project:
     {
       isWithinRadius:
           { $function:
              {
                 body: function(latitude, longitude) {
                    return geolib.isPointWithinRadius(
                      { latitude, longitude },
                      center,
                      radius
                    ); // compléter
                 },
                 args: [ "$coordinates.latitude", "$coordinates.longitude" ], // checker $.$
                 lang: "js"
              }
           },
           // enchaîner avec un filter ?
      }
   }
] )
*/


module.exports = router;