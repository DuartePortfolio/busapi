const db = require('../models')
const Route = db.Route
const Stop = db.Stop
const RouteStop = db.RouteStop

// GET /api/routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll()
    res.json(routes)
  } catch (err) {
    res.status(500).json({ error: 'Error displaying routes.' })
  }
}

// GET /api/routes/:id
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id)
    if (!route) return res.status(404).json({ error: 'Route not found.' })
    res.json(route)
  } catch (err) {
    res.status(500).json({ error: 'Error obtaining route.' })
  }
}

// GET /api/routes/:id/stops
exports.getStopsOfRoute = async (req, res) => {
  try {
    const { stop_order } = req.query
    const includeOptions = {
      model: Stop,
      as: 'stops',
      through: { attributes: ['stop_order'] }
    }

    // If stop_order is provided as query parameter filter the stops
    if (stop_order !== undefined) {
      includeOptions.through.where = { stop_order: Number(stop_order) }
    }

    const route = await Route.findByPk(req.params.id, {
      include: [includeOptions],
      order: [[{ model: Stop, as: 'stops' }, RouteStop, 'stop_order', 'ASC']]
    })

    if (!route) return res.status(404).json({ error: 'Route not found.' })
    res.json(route.stops)
  } catch (err) {
    res.status(500).json({ error: 'Error obtaining stops for route.' })
  }
}

// POST /api/routes
exports.createRoute = async (req, res) => {
  try {
    const { route_name } = req.body
    if (!route_name) {
      return res.status(400).json({ error: 'route_name is required.' })
    }
    const newRoute = await Route.create({ route_name })
    res.status(201).json(newRoute)
  } catch (err) {
    res.status(500).json({ error: 'Error creating route.' })
  }
}

// POST /api/routes/:id/stops
exports.addStopToRoute = async (req, res) => {
  try {
    const { stop_id, stop_order } = req.body
    const { id } = req.params
    if (!stop_id || stop_order === undefined) {
      return res.status(400).json({ error: 'stop_id and stop_order are required.' })
    }
    const route = await Route.findByPk(id)
    if (!route) return res.status(404).json({ error: 'Route not found.' })
    const stop = await Stop.findByPk(stop_id)
    if (!stop) return res.status(404).json({ error: 'Stop not found.' })

    const [routeStop, created] = await RouteStop.findOrCreate({
      where: { route_id: id, stop_id },
      defaults: { stop_order }
    })
    if (!created) {
      await routeStop.update({ stop_order })
    }
    res.status(201).json({ message: 'Stop added to route.' })
  } catch (err) {
    res.status(500).json({ error: 'Error adding stop to route.' })
  }
}

// PATCH /api/routes/:id
exports.updateRoute = async (req, res) => {
  try {
    const { route_name } = req.body
    const route = await Route.findByPk(req.params.id)
    if (!route) return res.status(404).json({ error: 'Route not found.' })
    if (route_name) route.route_name = route_name
    await route.save()
    res.json(route)
  } catch (err) {
    res.status(500).json({ error: 'Error updating route.' })
  }
}

// DELETE /api/routes/:id
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id)
    if (!route) return res.status(404).json({ error: 'Route not found.' })
    await route.destroy()
    res.json({ message: 'Route deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Error deleting route.' })
  }
}

// DELETE /api/routes/:route_id/stops/:stop_id
exports.deleteStopFromRoute = async (req, res) => {
  try {
    const route_id = Number(req.params.id) // ensures Route ID and Stop ID is a number
    const stop_id = Number(req.params.stop_id)

    if (isNaN(route_id) || isNaN(stop_id)) {
      return res.status(400).json({ error: 'route_id and stop_id must be numbers.' })
    }

    const routeStop = await RouteStop.findOne({ where: { route_id, stop_id } })
    if (!routeStop) {
      return res.status(404).json({ error: 'Stop not found in this route.' })
    }
    await routeStop.destroy()
    res.json({ message: 'Stop removed from route.' })
  } catch (err) {
    console.error('Error removing stop from route:', err)
    res.status(500).json({ error: 'Error removing stop from route.' })
  }
}