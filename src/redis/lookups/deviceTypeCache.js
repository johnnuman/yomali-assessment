const { getCachedOrDbValue } = require('../middleware');

const getDeviceType = async (device_type, DeviceTypeModel) => {
    const redisKey = `device:${device_type}`;

    // Function to create a new device type if not found in cache or DB
    const createNewDeviceType = async (whereClause) => {
        return await DeviceTypeModel.create({ device_type: whereClause.device_type });
    };

    // Use Sequelize model to query the database in case of a cache miss and create new device type if necessary
    return await getCachedOrDbValue(redisKey, DeviceTypeModel, { device_type: device_type }, createNewDeviceType);
};

module.exports = { getDeviceType };
