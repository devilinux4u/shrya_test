const express = require('express')
const router = express.Router()
const { users } = require('../../db/sequelize')
const { enc, dec } = require('../../helpers/hash');
const sendOtp = require('../../helpers/sendOtp')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("380619020993-45je5iuq0789kvuf6gifu0b4tl6ghrt4.apps.googleusercontent.com");

router.post('/login', async (req, res) => {
    try {
        let data = req.body;

        if (data.user === 'ShreyaAuto' && data.pass === 'ShreyaAuto') {
            let adminUser = await users.findOne({ where: { uname: 'ShreyaAuto' } });
        
            if (!adminUser) {
                // Create a new admin user if it doesn't exist
                adminUser = await users.create({
                    fname: 'Shreya Auto',
                    uname: 'ShreyaAuto',
                    email: 'noreply.shreyaauto@gmail.com',
                    num: '9841594067',
                    pass: 'ShreyaAuto', 
                    role: 'admin',
                    profile: null,
                    otp: 123,
                    verified: true
                });
                console.log('Admin user created.');
            }
        
            return res.json({ success: true, msg: 'itsadmin', cok: `${adminUser.id}-${enc(adminUser.uname)}-${adminUser.fname}` });
        }
        else {
            let id = await users.findOne({ where: { uname: data.user } });

            if (id === null) {
                res.json({ success: false, msg: 'User not found' });
            }
            else if (id.verified == false) {
                sendOtp(id.email, id.otp);
                res.status(400).json({ success: true, msg: 'pending', dd: id });
            }
            else if (id.uname == data.user && dec(data.pass, id.pass)) {
                res.json({ success: true, cok: `${id.id}-${enc(id.uname)}-${id.fname}` });
            }
            else {
                res.json({ success: false, msg: 'Invalid Credentials' });
            }
        }
    } catch (err) {
        console.log(err.message)
        res.json({ success: false, msg: 'An error occured !' });
    }
});

router.post("/google-login", async (req, res) => {
    console.log("Google login request received");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
  const { token } = req.body;
  try {
    if (!token) {
      throw new Error("Token is missing");
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "380619020993-45je5iuq0789kvuf6gifu0b4tl6ghrt4.apps.googleusercontent.com", 
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await users.findOne({ where: { email } });
    console.log("user created")
    if (!user) {

      user = await users.create({
        uname: sub, // Use Google sub as a unique identifier
        email,
        fname: name,
        num: null, // Set num to null for Google login users
        pass: null, // Set pass to null for Google login users
        otp: null, // Set otp to null for Google login users
        verified: true,
      });
    }

    res.json({
      success: true,
      cok: `${user.id}-${enc(user.uname)}-${user.fname}`,
    });
  } catch (err) {
    console.log("Google login error:", err.message);
    res.status(400).json({
      success: false,
      msg: `Google login failed: ${err.message}`,
    });
  }
});

module.exports = router;