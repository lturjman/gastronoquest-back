const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    questionNumber: Number,
    question: String,
    answers: [String],
    rightAnswer: String,
    comment: String,
    articleUrl: String
}, { _id: false });

const quizSchema = mongoose.Schema({
  quizNumber: Number,
  title: String,
  difficulty: String,
  questions: [questionSchema],
});

const Quiz = mongoose.model('quizzes', quizSchema);

module.exports = Quiz;