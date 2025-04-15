// Fonction pour construire la query MongoDB en fonction des filtres de recherche de restaurant

const constructQuery = (reqBody) => {
    const { name, address, priceRange, badges, types } = reqBody;
    const query = {};

    if (name) query.name = { $regex: new RegExp(name, "i") };
    if (address) query.address = new RegExp(`\\b${address}$`, "i");

    if (priceRange) query.priceRange = priceRange;
    if (badges) query.badges = { $in: badges };
    if (types) query.types = { $in: types };

    return query;
};

module.exports = { constructQuery };