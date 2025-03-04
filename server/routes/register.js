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
            return res.send({ value: false, msg: 'User already exists' });
        }

        // Encrypt the password
        let hashedPass = enc(data.pass);

        // Create a new user
        let newUser = await users.create({
            uname: data.user,
            email: data.email,
            pass: hashedPass
        });

        res.send({ value: true, msg: 'User created successfully' });
    } catch (err) {
        console.log(err.message);
        res.send({ value: 'err' });
    }
});

module.exports = router;
