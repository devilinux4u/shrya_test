const express = require('express');
const router = express.Router();
const { RentalAllVehicles, RentalAllVehicleImages, sequelize } = require('../../db/sequelize'); 
const { Sequelize } = require('sequelize'); 

// Route to get one random rental vehicle
router.get('/ran1', async (req, res) => {
    try {
        const randomVehicle = await RentalAllVehicles.findOne({
            include: [
                {
                    model: RentalAllVehicleImages,
                    as: 'rentVehicleImages' 
                }
            ],

            order: [Sequelize.literal('RAND()')]
            ,
        });

        if (!randomVehicle) return res.status(404).json({ message: 'No data found' });

        console.log(randomVehicle)

        res.json(randomVehicle);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Route to get six random rental vehicles
router.get('/ran6', async (req, res) => {
    try {
        const randomVehicles = await RentalAllVehicles.findAll(
            {
                include: [
                    {
                        model: RentalAllVehicleImages,
                        as: 'rentVehicleImages' 
                    }
                ],
                order: [Sequelize.literal('RAND()')], limit: 6
            });

        if (!randomVehicles.length) return res.status(404).json({ message: 'No data found' });
        res.json(randomVehicles);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Route to get all rental vehicles
router.get('/all', async (req, res) => {
    try {
        const allVehicles = await RentalAllVehicles.findAll({
            include: [
                {
                    model: RentalAllVehicleImages,
                    as: 'rentVehicleImages'
                }
            ],
    });
        res.json(allVehicles);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Route to get one rental vehicles info
router.get('/one/:id', async (req, res) => {
    try {
        const allVehicles = await RentalAllVehicles.findAll({
            where: { id: req.params.id },
            include: [
                {
                    model: RentalAllVehicleImages,
                    as: 'rentVehicleImages' 
                }
            ],
    });
        res.json(allVehicles);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;
