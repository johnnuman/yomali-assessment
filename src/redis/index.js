const { getUser } = require('./lookups/userCache');
const { getPage } = require('./lookups/pageCache');
const { getBrowser } = require('./lookups/browserCache');
const { getOperatingSystem } = require('./lookups/osCache');
const { getGeoLocation } = require('./lookups/geoCache');
const { getDeviceType } = require('./lookups/deviceTypeCache');

// I created this function to consolidate the cache layer by combining all lookup functions and using
// the Sequelize models from the db object.
function createRedisCache(redisClient, db) {
    return {
        getUser: (userId) => getUser(userId, db.User),
        getPage: (pageUrl) => getPage(pageUrl, db.Page),
        getBrowser: (browserName) => getBrowser(browserName, db.Browser),
        getOperatingSystem: (osName) => getOperatingSystem(osName, db.OperatingSystem),
        getGeoLocation: (country, region, city) => getGeoLocation(country, region, city, db.GeoLocation),
        getDeviceType: (deviceType) => getDeviceType(deviceType, db.DeviceType)
    };
}

module.exports = { createRedisCache };