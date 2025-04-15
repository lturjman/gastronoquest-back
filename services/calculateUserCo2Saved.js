// Fonction pour calculer le CO2 économisé par un utilisateur

const calculateUserCo2Saved = (quests) => {
  let totalSavedCo2 = 0;

  for (let quest of quests) {
    for (let achievedChallenge of quest.achievedChallenges) {
      totalSavedCo2 += achievedChallenge.savedCo2;
    }
  }

  return totalSavedCo2;
};

module.exports = { calculateUserCo2Saved };
