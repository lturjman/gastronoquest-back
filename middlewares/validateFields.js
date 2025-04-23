// Middleware à passer dans les routes du backend pour vérifier si les champs nécessaires sont bien présents

const validateFields = (requiredFields, location = "body") => {
  return (req, res, next) => {
    // Récupération des éléments à vérifier dans la requête
    const data = req[location];
    // On filtre pour ne garder que les éléments manquants
    // Utilisation de undefined pour éviter de considérer comme manquants des champs avec une valeur falsy
    const missingFields = requiredFields.filter(
      (field) => data[field] === undefined
    );

    // On envoie une erreur en cas de champ manquant
    if (missingFields.length > 0) {
      return res.status(400).json({
        result: false,
        error: `fields missing: ${missingFields.join(", ")}`,
      });
    }
    next();
  };
};

module.exports = { validateFields };
