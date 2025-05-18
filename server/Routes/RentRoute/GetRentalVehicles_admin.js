const express = require('express');
const router = express.Router();
const db = require('../../Database/Sequelize');
const { rental } = require('../../Database/Model');
const cancelEmail = require('../../Controllers/CancelMsg');
const { Op } = require('sequelize');



// GET all rental vehicles
router.get('/', async (req, res) => {
  try {
    const vehiclesData = await db.RentalAllVehicles.findAll({
      include: [
        {
          model: db.RentalAllVehicleImages,
          as: 'rentVehicleImages' 
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
      where: {
        status: {
          [Op.in]: ['active', 'late', 'pending']
        }
      },
      include: [
        {
          model: db.users,
          attributes: ['id', 'fname', 'uname', 'email', 'num'], 
        },
        {
          model: db.RentalAllVehicles,
          include: [
            {
              model: db.RentalAllVehicleImages,
              as: 'rentVehicleImages', 
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: vehiclesData,
    });
  } catch (error) {
    console.error('Error fetching rental vehicles:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
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
          attributes: ['id', 'fname', 'uname', 'email', 'num'] 
        },
        {
          model: db.RentalAllVehicles,
          include: [
            {
              model: db.RentalAllVehicleImages,
              as: 'rentVehicleImages'
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
      where: {
        status: {
          [Op.in]: ['cancelled', 'completed', 'completed_late']
        }
      },
      include: [
        {
          model: db.users,
          attributes: ['id', 'fname', 'uname', 'email', 'num'] 
        },
        {
          model: db.RentalAllVehicles,
          include: [
            {
              model: db.RentalAllVehicleImages,
              as: 'rentVehicleImages'
            }
          ]
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



// GET all active rental vehicles for MyBooking :client side
router.get('/active/user/all/:id', async (req, res) => {
  try {
    const vehiclesData = await db.rental.findAll({
      where: {
        userId: req.params.id,
        status: {
          [Op.in]: ['cancelled', 'completed', 'completed_late', 'late', 'pending', 'active']
        }
      },
      include: [
        {
          model: db.users,
          attributes: ['id', 'fname', 'uname', 'email', 'num'] 
        },
        {
          model: db.RentalAllVehicles,
          include: [
            {
              model: db.RentalAllVehicleImages,
              as: 'rentVehicleImages'
            }
          ]
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


// PUT route to cancel a booking
router.put("/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the item
    const report = await db.rental.findByPk(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Update the status to 'resolved'
    report.status = "cancelled";
    await report.save();

    if (
      report.paymentMethod == 'payLater'
    ) {
      const existingTransaction = await db.Transaction.findOne({ where: { bookingId: report.id } });

      if (existingTransaction) {
        existingTransaction.status = 'cancelled';
        await existingTransaction.save();
      };
    }

    cancelEmail(req.body.reason, req.body.data,req.body.isAdmin)

    res.status(200).json({ success: true, message: "Item marked as resolved", data: report });
  } catch (error) {
    console.error("Error updating item status:", error);
    res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
  }
});

// PUT route to update a rental booking :admin side activeRental Page
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the rental
    const report = await db.rental.findByPk(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Update the status
    report.status = req.body.status;
    await report.save();

    // If status is 'completed' or 'late_completed' AND paymentMethod is NOT 'payLater'
    if (
      (req.body.status === 'completed' || req.body.status === 'completed_late') &&
      report.paymentMethod == 'payLater'
    ) {
      const existingTransaction = await db.Transaction.findOne({ where: { bookingId: report.id } });

      if (existingTransaction) {
        existingTransaction.status = 'paid';
        await existingTransaction.save();
      };
    }

    res.status(200).json({ success: true, message: "updated", data: report });

  } catch (error) {
    console.error("Error updating item status:", error);
    res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
  }
});


module.exports = router;