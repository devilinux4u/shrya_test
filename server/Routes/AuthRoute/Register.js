const express = require('express');
const router = express.Router();
const { users } = require('../../Database/Sequelize');
const { enc } = require('../../Controllers/Hash');
const sendOtp = require('../../Controllers/SendOtp');

router.post('/register', async (req, res) => {
    try {
        let data = req.body;

        // Check if the username already exists
        let existingUser = await users.findOne({ where: { uname: data.user } });
        if (existingUser) {
            return res.json({ success: false, msg: 'Username already exists' });
        }

        // Check if the email already exists
        let existingEmail = await users.findOne({ where: { email: data.email } });
        if (existingEmail) {
            return res.json({ success: false, msg: 'Email already registered' });
        }

        let existingPhone = await users.findOne({ where: { num: data.number } });
        if (existingPhone) {
            return res.json({ success: false, msg: 'Number already registered' });
        }

        // Encrypt the password
        let hashedPass = enc(data.pass);

        // Create a new user
        let newUser = await users.create({
            fname: data.name,
            uname: data.user,
            email: data.email,
            num: data.number,
            pass: hashedPass,
            otp: Math.floor(100000 + Math.random() * 900000),
            verified: false
        });

        sendOtp(newUser.email, newUser.otp);

        res.json({ success: true, msg: newUser });
    } catch (err) {
        console.log(err.message);
        res.json({ success: false, msg: 'An error occurred' });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { userId, otp } = req.body;

        console.log(userId, otp);

        // Check if user exists
        let user = await users.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(400).json({ success: false, msg: 'User not found' });
        }

        // Check if OTP is correct
        if (user.otp !== Number(otp)) {
            return res.status(400).json({ success: false, msg: 'Invalid OTP' });
        }

        // Update user as verified
        await users.update({ verified: true }, { where: { id: userId } });

        res.json({ success: true, msg: 'OTP verified successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'An error occurred' });
    }
});

module.exports = router;