const express = require('express');
const router = express.Router();
const db = require('../../db/sequelize');

// GET all rental vehicles
router.get('/', async (req, res) => {
  try {
    const vehiclesData = await db.RentalAllVehicles.findAll({
      include: [
        { 
          model: db.RentalAllVehicleImages,
          as: 'rentVehicleImages' // Match this with your association alias
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: vehiclesData
    });
  } catch (error) {
    console.error('Error fetching rental vehicles:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET single rental vehicle
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await db.RentalAllVehicles.findByPk(req.params.id, {
      include: [
        { 
          model: db.RentalAllVehicleImages,
          as: 'images'
        }
      ]
    });
    
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        error: 'Rental vehicle not found' 
      });
    }
    
    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Error fetching rental vehicle:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// DELETE a rental vehicle
router.delete('/:id', async (req, res) => {
  try {
    // First delete associated images
    await db.RentalAllVehicleImages.destroy({
      where: { vehicleId: req.params.id }
    });
    
    // Then delete the vehicle
    const result = await db.RentalAllVehicles.destroy({
      where: { id: req.params.id }
    });
    
    if (result === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Rental vehicle not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Rental vehicle deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting rental vehicle:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;