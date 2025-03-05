const { Appointments, users, vehicles } = require('../../db/sequelize');

exports.createAppointment = async (req, res) => {
    try {
        const { userId, vehicleId, date, time, location, description } = req.body;
        const appointment = await Appointments.create({
            userId,
            vehicleId,
            date,
            time,
            location,
            description,
        });
        res.status(201).json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointments.findAll({
            include: [
                { 
                    model: users, 
                    as: 'user', 
                    attributes: ['fname', 'email', 'num'] 
                },
                { 
                    model: vehicles, 
                    as: 'vehicle', 
                    attributes: ['make', 'model', 'price', 'year', 'color', 'uid'],
                    include: [
                        { model: users, as: 'user', attributes: ['fname', 'email'] } // Include seller details
                    ]
                },
            ],
        });
        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch appointments" });
    }
};
