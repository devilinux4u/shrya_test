const express = require('express')
const router = express.Router()
const { users } = require('../db/sequelize')
const { enc, dec } = require('../helpers/hash')

router.post('/login', async (req, res) => {
    console.log('login initiated')
    try {
        let data = req.body;

        console.log(data)

        let id = await users.findOne({ where: { uname: data.user } });

        if (id === null) {
            res.send({ value: false });
        }
        else if (id.uname == data.user && dec(data.pass, id.pass)) {
            res.send({ value: true });
        } 
        else {
            res.send({ value: false });
        }
    } catch (err) {
        console.log(err.message)
        res.send({ value: 'err' });
    }
})


module.exports = router;