const express = require('express');
const router = express.Router();
const geolib = require('geolib');
const Restaurant = require('../models/restaurants');
const { validateFields } = require("../middlewares/validateFields");
const { constructQuery } = require("../services/constructQuery");

// Route pour chercher un restaurant par son nom (name)
router.post(
  '/restaurant',
  validateFields(["input"], "body"),
  async (req, res) => {
    try {
      // Récupération de tous les restaurants correspondant aux filtres de recherche
      const query = {
        name: { $regex: new RegExp(req.body.input, "i") },
        ...constructQuery(req.body)
      };
      const restaurants = await Restaurant.find(query).select("-__v");

      // Envoi des résultats
      res.status(200).json({ result: true, restaurants });

    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Internal servor error" });
    }  
});

// Route pour chercher des restaurants dans une ville précise (address)
router.post(
  '/address',
  validateFields(["input"], "body"),
  async (req, res) => {
    try {
      // Récupération de tous les restaurants correspondant aux filtres de recherche
      const query = {
        address: { $regex: new RegExp(`\\b${req.body.input}$`, "i") },
        ...constructQuery(req.body)
      };
      const restaurants = await Restaurant.find(query).select("-__v");

      // Envoi des résultats
      res.status(200).json({ result: true, restaurants });

    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Internal servor error" });
    }
});

// Route pour chercher des restaurants à proximité d'une ville (coordinates)
router.post(
  '/coordinates',
  validateFields(["input","distance"], "body"),
  async (req, res) => {
    try {
      const { input, distance } = req.body;

      // Requête au webservice permettant de récupérer les coordonnées d'une ville
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${input}`);
      const data = await response.json();
      const foundCity = data.features[0];

      if (!foundCity) return res.status(500).json({ result: false, error: "Internal server error"});

      const center = {
        latitude: foundCity.geometry.coordinates[1],
        longitude: foundCity.geometry.coordinates[0],
      };

      // Récupération de tous les restaurants correspondant aux filtres de recherche
      const query = constructQuery(req.body);
      const restaurants = await Restaurant.find(query).select("-__v");

      if (restaurants.length === 0) return res.status(200).json({ result: true, restaurants });

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

      // Envoi des résultats
      res.status(200).json({ result: true, restaurants: restaurantsWithinRadius });

    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Internal servor error" });
    }
});

// Route pour chercher des restaurants autour de soi, en fonction de la géolocalisation de l'utilisateur (coordinates)
router.post(
  '/geolocation',
  validateFields(["geolocation","distance"], "body"),
  async (req, res) => {
    try {
      const { geolocation, distance } = req.body;  

      // Récupération de tous les restaurants correspondant aux filtres
      const query = constructQuery(req.body);
      const restaurants = await Restaurant.find(query).select("-__v");

      if (restaurants.length === 0) return res.status(200).json({ result: true, restaurants });

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

      // Envoi des résultats
      res.status(200).json({ result: true, restaurants: restaurantsWithinRadius });

    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: "Internal servor error" });
    }
});

module.exports = router;