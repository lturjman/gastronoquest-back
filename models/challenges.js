const mongoose = require('mongoose');

const challengeSchema = mongoose.Schema({
  title: String,
  savedCo2: Number,
});

const Challenge = mongoose.model('challenges', challengeSchema);

module.exports = Challenge;