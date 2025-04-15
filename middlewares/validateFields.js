// Middleware à passer dans les routes du backend pour vérifier si les champs nécessaires sont bien présents

const validateFields = (requiredFields, location = "body") => {
  return (req, res, next) => {
    const data = req[location];
    const missingFields = requiredFields.filter((field) => !data[field]);

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
