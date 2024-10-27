const { getAsync, setAsync } = require('./redisClient');

// Middleware to get or set cache values for lookup data using Sequelize
const getCachedOrDbValue = async (key, model, whereClause, createNewRecordFn) => {
    // Try to get the value from Redis cache
    const cachedValue = await getAsync(key);

    if (cachedValue) {
        console.log(`Cache hit for ${key}`);
        return JSON.parse(cachedValue);
    }

    console.log(`Cache miss for ${key}. Checking database...`);

    // Cache miss: Get the value from the database using Sequelize
    let dbRecord = await model.findOne({ where: whereClause });

    if (dbRecord) {
        console.log(`Found in DB for ${key}. Caching and returning...`);
        // Set the value in Redis cache for future requests (stringify the object for Redis)
        await setAsync(key, JSON.stringify(dbRecord));
        return dbRecord;
    }

    // If not found in cache and DB, create a new record
    console.log(`Not found in DB. Creating new record for ${key}...`);

    // Use the provided function to create the new record in the DB
    dbRecord = await createNewRecordFn(whereClause);

    // After creating the new record, cache it and return the new value
    if (dbRecord) {
        await setAsync(key, JSON.stringify(dbRecord));
        console.log(`New record created and cached for ${key}`);
        return dbRecord;
    }

    // If creation fails for some reason, throw an error
    throw new Error(`Failed to create and cache a new record for ${key}`);
};

// Export the function for use in the application
module.exports = {
    getCachedOrDbValue
};
