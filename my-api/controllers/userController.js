const db = require('../models')
const User = db.User

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Error displaying users.' })
  }
}

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found.' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Error obtaining user.' })
  }
}

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }
    const { name, email, password, role, contact } = req.body

    if (!name || !email || !password || !role || !contact) {
      return res.status(400).json({ error: 'All fields are required.' })
    }
    if (!['driver', 'operator'].includes(role)) {
      return res.status(400).json({ error: 'Role must be driver or operator.' })
    }
    //if (!contact || typeof contact !== 'integer') {
      //return res.status(400).json({ error: 'Contact must be a number.' })
    //}

    const existingUser = await User.findOne({ where: { email}})
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use.' })
    }

    // encriptar password, falar com prof
    const newUser = await User.create({ name, email, password, role, contact })
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({
      error: 'Internal error creating user.',
      details: err.message
    })
  }
}

// PATCH /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }
    const { name, email, password, role, contact } = req.body

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    if (role && !['driver', 'operator'].includes(role)) {
      return res.status(400).json({ error: 'Role must be driver or operator.' })
    }

    await user.update({ name, email, password, role, contact })
    res.json(user)
  } catch (err) {
    res.status(500).json({
      error: 'Internal error updating user.',
      details: err.message
    })
  }
}

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found.' })

    await user.destroy()
    res.json({ message: 'User deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user.' })
  }
}