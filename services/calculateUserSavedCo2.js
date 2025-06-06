// Fonction pour calculer le CO2 économisé par un utilisateur

const calculateUserSavedCo2 = (quests) => {
  let totalSavedCo2 = 0;

  for (let quest of quests) {
    for (let achievedChallenge of quest.achievedChallenges) {
      totalSavedCo2 += achievedChallenge.savedCo2 * 100;
    }
  }

  totalSavedCo2 = Number(parseFloat(totalSavedCo2 / 100).toFixed(2));

  return totalSavedCo2;
};

module.exports = { calculateUserSavedCo2 };