const { getCachedOrDbValue } = require('../middleware');

const getOperatingSystem = async (os_name, OperatingSystemModel) => {
    const redisKey = `os:${os_name}`;

    // Function to create a new operating system if not found in cache or DB
    const createNewOperatingSystem = async (whereClause) => {
        return await OperatingSystemModel.create({ os_name: whereClause.os_name });
    };

    // Use Sequelize model to query the database in case of a cache miss and create new OS if necessary
    return await getCachedOrDbValue(redisKey, OperatingSystemModel, { os_name }, createNewOperatingSystem);
};

module.exports = { getOperatingSystem };
