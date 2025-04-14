const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    questionNumber: Number,
    question: String,
    answers: [String],
    rightAnswer: String,
    comment: String,
    articleUrl: String
});

const quizSchema = mongoose.Schema({
  quizNumber: Number,
  title: String,
  difficulty: String,
  questions: [questionSchema],
});

const Quiz = mongoose.model('quiz', quizSchema);

module.exports = Quiz;