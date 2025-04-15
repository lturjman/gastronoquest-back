const mongoose = require('mongoose');

const questSchema = mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurants' },
  date: Date,
  achievedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'challenges' }],
}, { _id: false });

const quizSchema = mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'quiz' },
  score: Number,
  passed: Boolean,
}, { _id: false })

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  createdAt: { type: Date, default: Date.now },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'restaurants' }],
  quests: [questSchema],
  quizResults: [quizSchema],
});

const User = mongoose.model('users', userSchema);

module.exports = User;