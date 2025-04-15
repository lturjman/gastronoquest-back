// Fonction pour calculer le niveau d'un utilisateur

const calculateUserLevel = (quizResults) => {
  const completedQuiz = quizResults.filter(
    (quizResult) => quizResult.passed === true
  );

  const nbCompletedQuiz = completedQuiz.length;

  switch (nbCompletedQuiz) {
    case 0:
    case 1:
      return "jeune pousse";
    case 2:
      return "curieux";
    case 3:
      return "padawan";
    case 4:
      return "maître jedi";
    default:
      return "vieille branche";
  }
};

module.exports = { calculateUserLevel };
