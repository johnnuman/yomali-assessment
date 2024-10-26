const express = require('express')
const dotenv = require('dotenv')
dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Welcome to ${process.env.APP_NAME}`);
});

app.listen(PORT, () => {
  console.log(`${process.env.APP_NAME}`);
  console.log(`Server is running on port ${PORT}`);
});