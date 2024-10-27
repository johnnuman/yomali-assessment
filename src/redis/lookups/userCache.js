const { getCachedOrDbValue } = require('../middleware');

const getUser = async (user_name, UserModel) => {
    const redisKey = `user:${user_name}`;

    // Function to create a new user if not found in cache or DB
    const createNewUser = async (whereClause) => {
        // Assuming whereClause contains the user_name (as used in findOne)
        return await UserModel.create({ name: whereClause.name });
    };

    // Use Sequelize model to query the database in case of a cache miss and create new user if necessary
    return await getCachedOrDbValue(redisKey, UserModel, { name: user_name }, createNewUser);
};

module.exports = { getUser };
