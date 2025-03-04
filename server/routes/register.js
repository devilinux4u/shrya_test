const express = require('express')
const router = express.Router()
const { users } = require('../db/sequelize')
const { enc } = require('../helpers/hash')

router.post('/register', async (req, res) => {
    try {
        let data = req.body;

        // Check if the user already exists
        let existingUser = await users.findOne({ where: { uname: data.user } });

        if (existingUser) {
            return res.json({ success: false, msg: 'User already exists' });
        }

        // Encrypt the password
        let hashedPass = enc(data.pass);

        // Create a new user
        let newUser = await users.create({
            fname: data.name,
            uname: data.user,
            email: data.email,
            num: data.number,
            pass: hashedPass
        });

        res.json({ success: true, msg: 'Registration successful!' });
    } catch (err) {
        console.log(err.message);
        res.json({ success: false, msg: 'An error occurred' });
    }
});

module.exports = router;
