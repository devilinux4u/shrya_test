require('dotenv').config();

const express = require('express');
const router = express.Router();
const { Transaction, rental } = require('../db/sequelize');


router.post('/api/verify-khalti', async (req, res) => {
    const { pidx } = req.body;

    try {
        const ress = await fetch('https://dev.khalti.com/api/v2/epayment/lookup/', {
            method: 'POST',
            headers: {
                'Authorization': `key ${process.env.KHALTI_API}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pidx })
        });

        const response = await ress.json();

        if (response.status == 'Completed') {
            const transaction = await Transaction.findOne({ where: { pidx } });

            if (!transaction) {
                return res.status(404).json({ success: false, message: 'Transaction not found' });
            }

            transaction.status = 'paid';
            await transaction.save();

            await rental.update(
                { status: 'active' },
                { where: { id: transaction.bookingId } }
            );
        }

        return res.json(response); 
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Verification failed' });
    }
});



module.exports = router;