const db = require('../models')
const Stop = db.Stop

// GET /api/stops
exports.getAllStops = async (req, res) => {
  try {
    const { latitude, longitude, stop_name } = req.query

    let whereClause = {}
    if (latitude) {
      whereClause.latitude = latitude
    }
    if (longitude) {
      whereClause.longitude = longitude
    }
    if (stop_name) {
      whereClause.stop_name = stop_name
    }

    const stops = await Stop.findAll({ where: whereClause })
    res.json(stops)
  } catch (err) {
    res.status(500).json({ error: 'Error displaying stops.' })
  }
}

// GET /api/stops/:id
exports.getStopById = async (req, res) => {
  try {
    const stop = await Stop.findByPk(req.params.id)
    if (!stop) return res.status(404).json({ error: 'Stop not found.' })
    res.json(stop)
  } catch (err) {
    res.status(500).json({ error: 'Error obtaining stop.' })
  }
}

// POST /api/stops
exports.createStop = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }

    const { latitude, longitude, stop_name } = req.body

    if (latitude === undefined || typeof latitude !== 'number') {
      return res.status(400).json({ error: 'latitude must be a number.' })
    }
    if (longitude === undefined || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'longitude must be a number.' })
    }
    if (!stop_name || typeof stop_name !== 'string') {
      return res.status(400).json({ error: 'stop_name must be a string.' })
    }

    const newStop = await Stop.create({ latitude, longitude, stop_name })

    res.status(201).json(newStop)
  } catch (err) {
    console.error('Error creating stop:', err)
    res.status(500).json({
      error: 'Internal error creating stop.',
      details: err.message
    })
  }
}

// PATCH /api/stops/:id
exports.updateStop = async (req, res) => {
  try {
    const { id } = req.params

    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }

    const { latitude, longitude, stop_name } = req.body

    const stop = await Stop.findByPk(id)
    if (!stop) {
      return res.status(404).json({ error: 'Stop not found.' })
    }

    if (latitude !== undefined && typeof latitude !== 'number') {
      return res.status(400).json({ error: 'latitude must be a number.' })
    }
    if (longitude !== undefined && typeof longitude !== 'number') {
      return res.status(400).json({ error: 'longitude must be a number.' })
    }
    if (stop_name !== undefined && typeof stop_name !== 'string') {
      return res.status(400).json({ error: 'stop_name must be a string.' })
    }

    // Update
    await stop.update({ latitude, longitude, stop_name })

    res.json(stop)
  } catch (err) {
    console.error('Error updating stop:', err)
    res.status(500).json({
      error: 'Internal error updating stop.',
      details: err.message
    })
  }
}

// DELETE /api/stops/:id
exports.deleteStop = async (req, res) => {
  try {
    const stop = await Stop.findByPk(req.params.id)
    if (!stop) return res.status(404).json({ error: 'Stop not found.' })

    await stop.destroy()
    res.json({ message: 'Stop deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Error deleting stop.' })
  }
}