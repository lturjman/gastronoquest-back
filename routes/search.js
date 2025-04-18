const express = require('express');
const router = express.Router();
const geolib = require('geolib');

const Restaurant = require('../models/restaurants');
const { constructQuery } = require("../services/constructQuery");


// Peut-être que ce sera plus intelligent de fusionner /restaurant et /address dans une seule route et de rajouter une valeur dans req.body pour savoir de quel type de recherche il s'agit
// Intégrer le autocomplete et voir comment ça adapte les requêtes


// POST /search/restaurant : chercher un restaurant par son nom (name) et les filtres de recherche

router.post('/restaurant', async (req, res) => {
  try {
    // Blocage si la longueur de l'input est inférieure à 3
    if (req.body.name.length < 3) return res.status(200).json({ result: false });

    // Récupération de tous les restaurants correspondant aux filtres
    const query = constructQuery(req.body);
    const restaurants = await Restaurant.find(query).select("-__v");

    // Réponse
    if (restaurants.length === 0) {
      res.status(200).json({ result: false });
    } else {
      res.status(200).json({ result: true, restaurants });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal servor error" });
  }  
});


// POST /search/address : chercher un restaurant par son adresse (address)

router.post('/address', async (req, res) => {
  try {
    // Blocage si la longueur de l'input est inférieure à 3
    if (req.body.address.length < 3) return res.status(200).json({ result: false });

    // Récupération de tous les restaurants correspondant aux filtres
    const query = constructQuery(req.body);
    const restaurants = await Restaurant.find(query).select("-__v");

    // Réponse
    if (restaurants.length === 0) {
      res.status(200).json({ result: false });
    } else {
      res.status(200).json({ result: true, restaurants });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal servor error" });
  }
});


// POST /search/city : chercher un restaurant par sa ville (coordinates)

router.post('/city', async (req, res) => {
  try {
    // Blocage si la longueur de l'input est inférieure à 3
    if (req.body.city.length < 3) return res.status(200).json({ result: false });

    const { city, distance } = req.body;

    // Requête au webservice
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`);
    const data = await response.json();
    const foundCity = data.features[0];
    const center = {
      latitude: foundCity.geometry.coordinates[1],
      longitude: foundCity.geometry.coordinates[0],
    };

    // Récupération de tous les restaurants correspondant aux filtres
    const query = constructQuery(req.body);
    const restaurants = await Restaurant.find(query).select("-__v");

    // Récupération des restaurants dans le radius
    const radius = parseInt(distance) * 1000;
    const restaurantsWithinRadius = restaurants.filter(restaurant => 
      geolib.isPointWithinRadius({
          latitude: restaurant.coordinates.latitude,
          longitude: restaurant.coordinates.longitude
        }, // coordonnées du restaurant
        center, // coordonnées du point de référence
        radius // distance maximale en mètres
      ) === true
    );

    // Réponse
    if (restaurantsWithinRadius.length === 0) {
      res.status(200).json({ result: false });
    } else {
      res.status(200).json({ result: true, restaurants: restaurantsWithinRadius });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal servor error" });
  }
});


// POST /search/geolocalisation : chercher un restaurant en fonction de la géolocalisation de l'utilisateur (coordinates)

router.post('/geolocation', async (req, res) => {
  try {
    const { geolocation, distance } = req.body;  

    // Récupération de tous les restaurants correspondant aux filtres
    const query = constructQuery(req.body);
    const restaurants = await Restaurant.find(query).select("-__v");

    // Récupération des restaurants dans le radius
    const radius = parseInt(distance) * 1000;
    const restaurantsWithinRadius = restaurants.filter(restaurant => 
      geolib.isPointWithinRadius(
        { latitude: restaurant.coordinates.latitude,
          longitude: restaurant.coordinates.longitude }, // coordonnées du restaurant
        geolocation, // coordonnées du point de référence
        radius // distance maximale en mètres
      ) === true
    );

    if (restaurantsWithinRadius.length === 0) {
      res.status(200).json({ result: false });
    } else {
      res.status(200).json({ result: true, restaurants: restaurantsWithinRadius });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal servor error" });
  }
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