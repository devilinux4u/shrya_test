const express = require('express');
const router = express.Router();
const db = require('../../db/sequelize'); // Import your sequelize instance with models

// GET all vehicles
router.get('/', async (req, res) => {
  try {
    const vehiclesData = await db.vehicles.findAll({
      include: [
        { 
          model: db.v_img,
          as: 'vehicle_images' // Use the alias from sequelize.js
        },
        {
          model: db.users,
          as: 'user',
          attributes: ['id', 'fname', 'uname', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(vehiclesData);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET single vehicle
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await db.vehicles.findByPk(req.params.id, {
      include: [
        { 
          model: db.v_img,
          as: 'vehicle_images' // Use the alias from sequelize.js
        },
        {
          model: db.users,
          as: 'user',
          attributes: ['id', 'fname', 'uname', 'email']
        }
      ]
    });
    
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        error: 'Vehicle not found' 
      });
    }
    
    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// DELETE a vehicle
router.delete('/:id', async (req, res) => {
  try {
    // First delete associated images
    await db.v_img.destroy({
      where: { vehicleId: req.params.id }
    });
    
    // Then delete the vehicle
    const result = await db.vehicles.destroy({
      where: { id: req.params.id }
    });
    
    if (result === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Vehicle not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Vehicle deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
