const express = require('express')
const router = express.Router()
const { users } = require('../db/sequelize')
const { enc, dec } = require('../helpers/hash')

router.post('/login', async (req, res) => {
    try {
        let data = req.body;

        let id = await users.findOne({ where: { uname: data.user } });

        if (id === null) {
            res.send({ value: false, msg: 'User not found' });
        }
        else if (id.uname == data.user && dec(data.pass, id.pass)) {
            res.send({ value: true, cok: `${id.id}-${enc(id.uname)}` });
        } 
        else {
            res.send({ value: false, msg: 'Invalid Credentials' });
        }
    } catch (err) {
        console.log(err.message)
        res.send({ value: 'err' });
    }
}); 


module.exports = router;