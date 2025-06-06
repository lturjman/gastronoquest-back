// Fonction pour calculer le niveau d'un utilisateur, le prochain niveau à atteindre et la progression entre les deux niveaux

const levelThresholds = [
  { level: "Jeune pousse", icon: "🌱", co2: 10 },
  { level: "Petit arbuste", icon: "🪴", co2: 20 },
  { level: "Arbre fruitier", icon: "🍎", co2: 50 },
  { level: "Grand arbre", icon: "🌴", co2: 75 },
  { level: "Chêne centenaire", icon: "🌳", co2: 100 },
];

const calculateUserLevel = (co2) => {
  for (let i = 0; i < levelThresholds.length; i++) {
    if (co2 < levelThresholds[i].co2) {

      // Niveau actuel
      const currentLevel = levelThresholds[i];
      
      // Prochain niveau
      const nextLevel = {
        nextLevel: levelThresholds[i+1].level,
        icon: levelThresholds[i+1].icon,
        remaining: Number(parseFloat((levelThresholds[i].co2 * 100 - co2 * 100) / 100).toFixed(2)),
      };
      
      // Calcul du pourcentage de progression
      const previousThreshold = levelThresholds[i-1] ? levelThresholds[i-1].co2 : 0;
      let progressPercentage = ((co2 * 100 - previousThreshold * 100) / (currentLevel.co2 * 100 - previousThreshold * 100)) * 100;
      progressPercentage = Math.min(Math.max(progressPercentage, 0), 100);

      return { currentLevel, nextLevel, progressPercentage };
    }
  }
  // Max atteint
  const currentLevel = levelThresholds[levelThresholds.length - 1];
  return currentLevel;
};

module.exports = { calculateUserLevel };
