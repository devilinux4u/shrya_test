const express = require('express')
const router = express.Router()
const { contacts } = require('../../db/sequelize')

router.post('/contact', async (req, res) => {
    try {
        const { name, email, phno, msg } = req.body;

        // Store in database
        const newContact = await contacts.create({
            name, email, phno, msg
        });

        res.json({ success: true, msg: "Message sent Succesfully",});
    } catch (error) {
        console.error("Error saving contact message:", error);
        res.status(500).json({ success: false, msg: "Error while sending Message" });
    }
});

module.exports = router;
