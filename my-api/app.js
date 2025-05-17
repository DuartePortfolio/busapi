require('dotenv').config();

const express = require('express');
const { sequelize } = require('./models');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const vehicleRoutes = require('./routes/vehicleRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const stopRoutes = require('./routes/stopRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api', vehicleRoutes);
app.use('/api', weatherRoutes);
app.use('/api', stopRoutes);
app.use('/api', userRoutes);







app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;