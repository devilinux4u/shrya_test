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

// PUT route to update a rental vehicle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const vehicle = await db.RentalAllVehicles.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await vehicle.update(updatedData);

    res.json({ success: true, message: 'Vehicle updated successfully', data: vehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
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








// GET all active rental vehicles
router.get('/active/all', async (req, res) => {
  try {
    const vehiclesData = await db.rental.findAll({
      where: { status: 'active' },
      include: [
        {
          model: db.users,
          attributes: ['id', 'fname', 'uname', 'email'] // customize fields as needed
        },
        {
          model: db.RentalAllVehicles,
          include: [
            { 
              model: db.RentalAllVehicleImages,
            }
          ]
        }
      ]
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


// GET only one active rental vehicles
router.get('/active/one/:id', async (req, res) => {
  try {
    const vehiclesData = await db.rental.findAll({
      where: { id: req.params.id },
      include: [
        {
          model: db.users,
          attributes: ['id', 'fname', 'uname', 'email'] // customize fields as needed
        },
        {
          model: db.RentalAllVehicles,
          include: [
            { 
              model: db.RentalAllVehicleImages,
            }
          ]
        }
      ]
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

// GET all rental vehicles for rental history
router.get('/history/all', async (req, res) => {
  try {
    const vehiclesData = await db.rental.findAll({
      include: [
        {
          model: db.users,
          attributes: ['id', 'fname', 'uname', 'email'] // customize fields as needed
        },
        {
          model: db.RentalAllVehicles,
          include: [
            { 
              model: db.RentalAllVehicleImages,
            }
          ]
        }
      ]
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



module.exports = router;