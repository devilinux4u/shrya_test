const express = require("express");
const router = express.Router();
const { Appointment, users, vehicles, v_img } = require("../../db/sequelize");
const cancelEmail = require("../../helpers/appointmentCancelMsg");

router.post("/", async (req, res) => {
  const { userId, vehicleId, date, time, location, description } = req.body;

  console.log("Incoming request payload:", req.body); // Debug log

  try {
    const user = await users.findByPk(userId);
    const vehicle = await vehicles.findByPk(vehicleId);

    if (!user) {
      console.error("User not found with ID:", userId); // Debug log
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!vehicle) {
      console.error("Vehicle not found with ID:", vehicleId); // Debug log
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

    console.log("Appointment created successfully:", appointment); // Debug log
    res.status(201).json({ success: true, message: "Appointment created", data: appointment });
  } catch (error) {
    console.error("Error creating appointment:", error); // Debug log
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
          include: [{ model: v_img, attributes: ["id", "image"] }],
        },
        {
          model: users, // Ensure this matches the alias defined in the association
          attributes: ["id", "fname", "email", "num"],
        },
      ],
    });

    console.log("Appointments fetched successfully:", appointments); // Debug log
    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error); // Debug log
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch appointments as buyer
    const asBuyer = await Appointment.findAll({
      where: { userId },
      include: [
        {
          model: vehicles,
          as: "SellVehicle",
          include: [{ model: v_img, attributes: ["id", "image"] }],
        },
        {
          model: users,// Ensure this matches the alias defined in the association
          attributes: ["id", "fname", "email", "num"],
        },
      ],
      order: [["createdAt", "DESC"]], // Sort by creation date
    });

    // Fetch appointments as seller
    const asSeller = await Appointment.findAll({
      where: { SelleruserId: userId },
      include: [
        {
          model: vehicles,
          as: "SellVehicle",
          include: [{ model: v_img, attributes: ["id", "image"] }],
        },
        {
          model: users,// Ensure this matches the alias defined in the association
          attributes: ["id", "fname", "email", "num"],
        },
      ],
      order: [["createdAt", "DESC"]], // Sort by creation date
    });

    console.log("Appointments fetched successfully:", { asBuyer, asSeller }); // Debug log
    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data: { asBuyer, asSeller },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error); // Debug log
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, role } = req.body;
  // console.log(req.body) // Debug log

  console.log(`Updating status for appointment ID: ${id}`); // Debug log

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
        receivedId: id // Send back the ID we received for debugging
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

      cancelEmail(userEmail, appointment)

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
