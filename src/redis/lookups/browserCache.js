const { getCachedOrDbValue } = require('../middleware');

const getBrowser = async (browser_name, BrowserModel) => {
    const redisKey = `browser:${browser_name}`;

    // Function to create a new browser if not found in cache or DB
    const createNewBrowser = async (whereClause) => {
        return await BrowserModel.create({ browser_name: whereClause.browser_name });
    };

    // Use Sequelize model to query the database in case of a cache miss and create new browser if necessary
    return await getCachedOrDbValue(redisKey, BrowserModel, { browser_name: browser_name }, createNewBrowser);
};

module.exports = { getBrowser };
