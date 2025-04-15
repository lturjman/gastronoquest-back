const mongoose = require('mongoose');

const coordinatesSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
}, { _id: false });

const restaurantSchema = mongoose.Schema({
  name: String,
  desc: String,
  longDesc: String,
  score: Number,
  badges: [{ type: String, enum: ['', 'Bio', 'Circuit court', 'Locavore', 'Pêche durable', 'Vegan', 'Viande durable', 'Zéro-déchet', '100% Veggie', 'Contenant accepté'] }],
  types: [{ type: String, enum: ['', 'Bistronomique', 'Café-restaurant', 'Traiteurs', 'Food truck', 'Gastronomique', 'Sur le pouce', 'Sandwicherie', 'Street-food', 'Salon de thé', 'Bar à vin'] }],
  priceRange: { type: String, enum: ['', 'Moins de 15€', 'Entre 15€ et 30€', 'Entre 30€ et 50€', 'Entre 50€ et 100€', 'Plus de 100€'] },
  address: String,
  coordinates: coordinatesSchema,
  imageUrl: String,
  websiteUrl: String,
  bookingUrl: String,
});

const Restaurant = mongoose.model('restaurants', restaurantSchema);

module.exports = Restaurant;