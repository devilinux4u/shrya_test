const express = require("express");
const router = express.Router();
const { Appointment, users, vehicles, v_img } = require("../../Database/Sequelize");
const cancelEmail = require("../../Controllers/AppointmentCancelMsg");
const confirmEmail = require("../../Controllers/AppointmentConfirmMsg");

router.post("/", async (req, res) => {
  const { userId, vehicleId, date, time, location, description } = req.body;

  console.log("Incoming request payload:", req.body);

  try {
    const user = await users.findByPk(userId);
    const vehicle = await vehicles.findByPk(vehicleId);

    if (!user) {
      console.error("User not found with ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!vehicle) {
      console.error("Vehicle not found with ID:", vehicleId);
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }
    const sellVehicle = await vehicles.findOne({ where: { id: vehicleId } });
    const appointment = await Appointment.create({
      userId,
      SelleruserId: sellVehicle.uid,
      vehicleId,
      date,
      time,
      location,
      description,
      status: "pending",
    });

    console.log("Appointment created successfully:", appointment);
    res.status(201).json({ success: true, message: "Appointment created", data: appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        {
          model: vehicles,
          as: "SellVehicle",
          include: [
            {
              model: v_img,
              attributes: ["id", "image"],
            },
            {
              model: users,
              as: "Seller",
              attributes: ["id", "fname", "email", "num"]
            }
          ]
        },
        {
          model: users,
          as: "Buyer",
          attributes: ["id", "fname", "email", "num"]
        }
      ]
    });

    console.log("Appointments fetched successfully:", appointments);
    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const asBuyer = await Appointment.findAll({
      where: { userId },
      include: [
        {
          model: vehicles,
          as: "SellVehicle",
          include: [{ model: v_img, attributes: ["id", "image"] }],
        },
        {
          model: users,
          attributes: ["id", "fname", "email", "num"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const asSeller = await Appointment.findAll({
      where: { SelleruserId: userId },
      include: [
        {
          model: vehicles,
          as: "SellVehicle",
          include: [{ model: v_img, attributes: ["id", "image"] }],
        },
        {
          model: users,
          attributes: ["id", "fname", "email", "num"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log("Appointments fetched successfully:", { asBuyer, asSeller });
    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data: { asBuyer, asSeller },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, role, reason } = req.body;

  console.log(`Updating status for appointment ID: ${id}`);

  try {
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: vehicles,
          as: "SellVehicle",
          include: [{ model: v_img, attributes: ["id", "image"] }],
        },
        {
          model: users,
          attributes: ["id", "fname", "email", "num"],
        },
      ],
    });

    if (!appointment) {
      console.error(`Appointment not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
        receivedId: id
      });
    }

    appointment.status = status;
    await appointment.save();

    if (status === "cancelled") {
      let eid;
      if (role === 'buyer') {
        eid = appointment.SelleruserId;
      } else if (role === 'seller') {
        eid = appointment.userId;
      } else {
        console.log('Invalid role');
        return;
      }

      const userEmail = await users.findOne({ where: { id: eid } });

      await cancelEmail(userEmail, {
        ...appointment.dataValues,
        date: appointment.date,
        time: appointment.time,
        vehicleMake: appointment.SellVehicle.make,
        vehicleModel: appointment.SellVehicle.model,
        vehicleYear: appointment.SellVehicle.year,
        location: appointment.location
      }, reason);
    }

    if (status === "confirmed") {
      let eid;
      if (role === 'buyer') {
        eid = appointment.SelleruserId;
      } else if (role === 'seller') {
        eid = appointment.userId;
      } else {
        console.log('Invalid role');
        return;
      }

      const userEmail = await users.findOne({ where: { id: eid } });

      await confirmEmail(userEmail, {
        ...appointment.dataValues,
        date: appointment.date,
        time: appointment.time,
        vehicleMake: appointment.SellVehicle.make,
        vehicleModel: appointment.SellVehicle.model,
        vehicleYear: appointment.SellVehicle.year,
      });
    }

    console.log(`Successfully updated appointment ${id} to status: ${status}`);
    res.status(200).json({
      success: true,
      message: "Status updated",
      status,
      data: appointment
    });
  } catch (error) {
    console.error(`Error updating appointment ${id}:`, error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;