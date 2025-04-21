// Fonction pour calculer le CO2 économisé par un utilisateur

const calculateUserCo2Saved = (quests) => {
  let totalSavedCo2 = 0;

  for (let quest of quests) {
    for (let achievedChallenge of quest.achievedChallenges) {
      totalSavedCo2 += achievedChallenge.savedCo2 * 100;
    }
  }

  totalSavedCo2 = parseFloat(totalSavedCo2 / 100).toFixed(2);

  return totalSavedCo2;
};

module.exports = { calculateUserCo2Saved };