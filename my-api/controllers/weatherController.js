const db = require('../models');
const Weather = db.Weather;

// GET /api/weather
exports.getAllReadings = async (req, res) => {
  try {
    const { reading_id } = req.query;

    let whereClause = {};
    if (reading_id) {
      whereClause.reading_id = reading_id;
    }

    const { temperature } = req.query;
    if (temperature) {
      whereClause.temperature = temperature;
    }

    const { rain } = req.query;
    if (rain) {
      whereClause.rain = rain;
    }

    const { wind } = req.query;
    if (wind) {
      whereClause.wind = wind;
    }

    const { location } = req.query;
    if (location) {
      whereClause.location = location;
    }

    const { datetime } = req.query;
    if (datetime) {
      whereClause.datetime = datetime;
    }

    const { notes } = req.query;
    if (notes) {
      whereClause.notes = notes;
    }

    const readings = await Weather.findAll({ where: whereClause });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: 'Error displaying weather readings' });
  }
};


// GET /api/weather/:id
exports.getReadingById = async (req, res) => {
  try {
    const reading = await Weather.findByPk(req.params.id);
    if (!reading) return res.status(404).json({ error: 'Weather reading not found.' });
    res.json(reading);
  } catch (err) {
    res.status(500).json({ error: 'Error obtaining reading.' });
  }
};

// POST /api/weather
exports.createReading = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' });
    }

    const { temperature, rain, wind, location, datetime, notes } = req.body;

    // Validate required fields
    if (
      temperature === undefined || rain === undefined || wind === undefined || !location || !datetime
    ) {
      return res.status(400).json({ error: 'temperature, rain, wind, location, and datetime are required.' });
    }

    // Validate data types
    if (typeof temperature !== 'number') {
      return res.status(400).json({ error: 'temperature must be a number.' });
    }
    if (typeof rain !== 'number') {
      return res.status(400).json({ error: 'rain must be a number.' });
    }
    if (typeof wind !== 'number') {
      return res.status(400).json({ error: 'wind must be a number.' });
    }
    if (typeof location !== 'string') {
      return res.status(400).json({ error: 'location must be a string.' });
    }

    const newReading = await Weather.create({
      temperature,
      rain,
      wind,
      location,
      datetime,
      notes
    });

    res.status(201).json(newReading);
  } catch (err) {
    console.error('Error creating weather reading:', err);
    res.status(500).json({
      error: 'Internal error creating weather reading.',
      details: err.message
    });
  }
};

// PATCH /api/weather/:id
exports.updateReading = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' });
    }

    const { temperature, rain, wind, location, datetime, notes } = req.body;

    // Find weather reading
    const reading = await Weather.findByPk(id);
    if (!reading) {
      return res.status(404).json({ error: 'Weather reading not found.' });
    }

    // Validate fields if provided
    if (temperature !== undefined && typeof temperature !== 'number') {
      return res.status(400).json({ error: 'temperature must be a number.' });
    }
    if (rain !== undefined && typeof rain !== 'number') {
      return res.status(400).json({ error: 'rain must be a number.' });
    }
    if (wind !== undefined && typeof wind !== 'number') {
      return res.status(400).json({ error: 'wind must be a number.' });
    }
    if (location !== undefined && typeof location !== 'string') {
      return res.status(400).json({ error: 'location must be a string.' });
    }
    // Optionally validate datetime format here if needed

    // Update
    await reading.update({ temperature, rain, wind, location, datetime, notes });

    res.json(reading);
  } catch (err) {
    console.error('Error updating weather reading:', err);
    res.status(500).json({
      error: 'Internal error updating weather reading.',
      details: err.message
    });
  }
};

// DELETE /api/weather/:id
exports.deleteReading = async (req, res) => {
  try {
    const reading = await Weather.findByPk(req.params.id);
    if (!reading) return res.status(404).json({ error: 'Weather reading not found.' });

    await reading.destroy();
    res.json({ message: 'Weather reading deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting weather reading.' });
  }
};

