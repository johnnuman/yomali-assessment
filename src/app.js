const express = require('express');
const dotenv = require('dotenv');
const db = require('./models');
const redisClient = require('./redis/redisClient');
const { createRedisCache } = require('./redis');

const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const trackerRoutes = require('./routes/trackerRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());

// Setting CORS headers manually
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Replace with your frontend domain
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Allowed headers
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, auth headers)

    // Handle preflight requests for OPTIONS method
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// Function to start the server after DB connection
const checkDatabaseConnectivity = async (retries = 20, delay = 10000) => {
  while (retries) {
    try {
      console.log('Checking database connection...');

      // Authenticate Sequelize (wait for the connection to be successful)
      await db.sequelize.authenticate();
      console.log('Database connection established successfully.');

      // Connection is successful, we will now exit
      return;
    } catch (err) {
      retries -= 1;
      console.error(`Unable to connect to the database. Retries left: ${retries}`);
      if (!retries) {
        console.error(err);
        process.exit(1); // Exiting the process in case of any error.
      }
      // Wait before retrying
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

const setupServer = async () => {
    // Initialize Redis cache using Sequelize models and Redis client
    const redisCache = createRedisCache(redisClient, db);

    app.get('/', (req, res) => {
        res.send(`Welcome to ${process.env.APP_NAME}`);
    });

    app.use('/', trackerRoutes);
    app.use('/', rateLimiter, sessionRoutes(redisCache));
    app.use('/analytics', analyticsRoutes);

    app.use(errorHandler);

    console.log('Server startup process complete.');

    // Start the Express server
    app.listen(PORT, () => {
        console.log(`${process.env.APP_NAME} is running on port ${PORT}`);
    });
};

// Call the checkDatabaseConnectivity function
checkDatabaseConnectivity()
    .then(async () => {
        await setupServer();
    })
    .catch((err) => {
        console.error(`Unable to start ${process.env.APP_NAME}:`, err);
    });