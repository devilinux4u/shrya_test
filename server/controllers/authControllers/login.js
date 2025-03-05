const express = require('express')
const router = express.Router()
const { users } = require('../../db/sequelize')
const { enc, dec } = require('../../helpers/hash');
const sendOtp = require('../../helpers/sendOtp')
const { datacatalog } = require('googleapis/build/src/apis/datacatalog');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('646971647550-hmmidni9m1rll496melgbbsaajl8lqnn.apps.googleusercontent.com'); // Replace CLIENT_ID with your Google Client ID

router.post('/login', async (req, res) => {
    try {
        let data = req.body;

        if (data.user == 'admin' && data.pass == 'admin') {
            res.json({ success: true, msg: 'itsadmin' });
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

router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    try {
        if (!token) {
            throw new Error('Token is missing');
        }
        if (token.split('.').length !== 3) {
            console.log('Received token:', token);
            throw new Error('Invalid token format');
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '646971647550-hmmidni9m1rll496melgbbsaajl8lqnn.apps.googleusercontent.com', // Replace CLIENT_ID with your Google Client ID
        });
        const payload = ticket.getPayload();
        const { sub, email, name } = payload;

        let user = await users.findOne({ where: { email } });

        if (!user) {
            user = await users.create({ uname: sub, email, fname: name, verified: true });
        }

        res.json({ success: true, cok: `${user.id}-${enc(user.uname)}-${user.fname}` });
    } catch (err) {
        console.log('Google login error:', err.message);
        res.status(400).json({ success: false, msg: `Google login failed: ${err.message}` });
    }
});

module.exports = router;