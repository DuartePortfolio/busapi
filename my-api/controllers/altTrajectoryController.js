const db = require('../models')
const AlternativeTrajectory = db.AlternativeTrajectory

// GET /api/alternative-trajectories
exports.getAllAlternativeTrajectories = async (req, res) => {
  try {
    const { stop_id_1, stop_id_2 } = req.query

    let whereClause = {}
    if (stop_id_1) {
      whereClause.stop_id_1 = stop_id_1
    }
    if (stop_id_2) {
      whereClause.stop_id_2 = stop_id_2
    }

    const altTrajs = await AlternativeTrajectory.findAll({ where: whereClause })
    res.json(altTrajs)
  } catch (err) {
    res.status(500).json({ error: 'Error displaying alternative trajectories.' })
  }
}

// GET /api/alternative-trajectories/:id
exports.getAlternativeTrajectoryById = async (req, res) => {
  try {
    const altTraj = await AlternativeTrajectory.findByPk(req.params.id)
    if (!altTraj) return res.status(404).json({ error: 'Alternative trajectory not found.' })
    res.json(altTraj)
  } catch (err) {
    res.status(500).json({ error: 'Error obtaining alternative trajectory.' })
  }
}

// POST /api/alternative-trajectories
exports.createAlternativeTrajectory = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }
    const { stop_id_1, stop_id_2, alt_trajectory } = req.body

    if (!stop_id_1 || !stop_id_2 || !alt_trajectory) {
      return res.status(400).json({ error: 'stop_id_1, stop_id_2, and alt_trajectory are required.' })
    }

    const newAltTraj = await AlternativeTrajectory.create({ stop_id_1, stop_id_2, alt_trajectory })

    res.status(201).json(newAltTraj)
  } catch (err) {
    console.error('Error creating alternative trajectory:', err)
    res.status(500).json({
      error: 'Internal error creating alternative trajectory.',
      details: err.message
    })
  }
}

// PATCH /api/alternative-trajectories/:id
exports.updateAlternativeTrajectory = async (req, res) => {
  try {
    const { id } = req.params

    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }
    const { stop_id_1, stop_id_2, alt_trajectory } = req.body
    const altTraj = await AlternativeTrajectory.findByPk(id)
    if (!altTraj) {
      return res.status(404).json({ error: 'Alternative trajectory not found.' })
    }

    await altTraj.update({ stop_id_1, stop_id_2, alt_trajectory })

    res.json(altTraj)
  } catch (err) {
    console.error('Error updating alternative trajectory:', err)
    res.status(500).json({
      error: 'Internal error updating alternative trajectory.',
      details: err.message
    })
  }
}

// DELETE /api/alternative-trajectories/:id
exports.deleteAlternativeTrajectory = async (req, res) => {
  try {
    const altTraj = await AlternativeTrajectory.findByPk(req.params.id)
    if (!altTraj) return res.status(404).json({ error: 'Alternative trajectory not found.' })
    await altTraj.destroy()
    res.json({ message: 'Alternative trajectory deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Error deleting alternative trajectory.' })
  }
}