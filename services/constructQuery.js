// Fonction pour construire la query MongoDB en fonction des filtres de recherche de restaurant

const constructQuery = (reqBody) => {
    const { priceRange, badges, types } = reqBody;
    const query = {};
    if (priceRange && priceRange !== "Tous les prix") query.priceRange = priceRange;
    if (badges && badges.length > 0) query.badges = { $in: badges };
    if (types && types.length > 0) query.types = { $in: types };
    return query;
};

module.exports = { constructQuery };