const express = require('express');
const router = express.Router();
const { contacts } = require('../../Database/Sequelize');

// Store a new contact message
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phno, msg, status = "new" } = req.body; // Default status to "new" if not provided

    const newContact = await contacts.create({
      name,
      email,
      phno,
      msg,
      status,
    });

    res.json({ success: true, msg: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ success: false, msg: "Error while sending message" });
  }
});

// Retrieve all contact messages
router.get('/contact', async (req, res) => {
  try {
    const allContacts = await contacts.findAll({
      attributes: ['id', 'name', 'email', 'phno', 'msg', 'date', 'status'], // Include the status field
    });
    res.json(allContacts || []); 
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ success: false, msg: "Error while fetching messages", error: error.message });
  }
});

// Update the status of a contact message
router.put('/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await contacts.findByPk(id);
    if (!contact) {
      return res.status(404).json({ success: false, msg: "Message not found" });
    }

    contact.status = status;
    await contact.save();

    res.json({ success: true, msg: "Message status updated successfully" });
  } catch (error) {
    console.error("Error updating contact message status:", error);
    res.status(500).json({ success: false, msg: "Error while updating status" });
  }
});

// Delete a contact message
router.delete('/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await contacts.findByPk(id);
    if (!contact) {
      return res.status(404).json({ success: false, msg: "Message not found" });
    }

    await contact.destroy();
    res.json({ success: true, msg: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ success: false, msg: "Error while deleting message" });
  }
});

module.exports = router;
