const express = require('express')
const router = express.Router()
const { users } = require('../../db/sequelize')
const { enc, dec } = require('../../helpers/hash');
const sendOtp = require('../../helpers/sendOtp')
const { datacatalog } = require('googleapis/build/src/apis/datacatalog');
 
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


module.exports = router;