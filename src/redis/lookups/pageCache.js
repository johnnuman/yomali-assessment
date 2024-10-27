const { getCachedOrDbValue } = require('../middleware');

const getPage = async (pageUrl, PageModel) => {
    const redisKey = `page:${pageUrl}`;

    // Function to create a new page if not found in cache or DB
    const createNewPage = async (whereClause) => {
        return await PageModel.create({ page_url: whereClause.page_url });
    };

    // Use Sequelize model to query the database in case of a cache miss and create new page if necessary
    return await getCachedOrDbValue(redisKey, PageModel, { page_url: pageUrl }, createNewPage);
};

module.exports = { getPage };
