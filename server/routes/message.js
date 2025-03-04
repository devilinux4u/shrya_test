const express = require('express')
const router = express.Router()
const { contacts } = require('../db/sequelize')

router.post('/contact', async (req, res) => {
    try {
        const { fname, lname, email, phno, sub, msg } = req.body;

        // Store in database
        const newContact = await contacts.create({
            fname, lname, email, phno, sub, msg
        });

        res.json({ value: true, message: "Message sent Succesfully",});
    } catch (error) {
        console.error("Error saving contact message:", error);
        res.status(500).json({ value: false, message: "Error while sending Message" });
    }
});

module.exports = router;
