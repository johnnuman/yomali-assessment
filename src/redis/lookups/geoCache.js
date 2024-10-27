const { getCachedOrDbValue } = require('../middleware');

const getGeoLocation = async (country, region, city, GeoLocationModel) => {
    const redisKey = `geo:${country}-${region}-${city}`;

    // Function to create a new geo location if not found in cache or DB
    const createNewGeoLocation = async (whereClause) => {
        return await GeoLocationModel.create({
            country: whereClause.country,
            region: whereClause.region,
            city: whereClause.city
        });
    };

    // Use Sequelize model to query the database in case of a cache miss and create new geo location if necessary
    return await getCachedOrDbValue(redisKey, GeoLocationModel, { country, region, city }, createNewGeoLocation);
};

module.exports = { getGeoLocation };
