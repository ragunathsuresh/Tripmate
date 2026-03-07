const dotenv = require('dotenv');
const connectDB = require('../config/db');
const app = require('../app');

dotenv.config();
connectDB();

module.exports = app;
