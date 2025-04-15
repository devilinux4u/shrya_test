const express = require('express');
const router = express.Router();
const { Transaction, rental, users } = require('../db/sequelize');


router.get('/api/transaction', async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
          include: [
            {
              model: rental, 
              include: [
                {
                  model: users,
                  attributes: ['id', 'fname', 'uname', 'email', 'num', 'profile']
                }
              ]
            }
          ],
          order: [['createdAt', 'DESC']]
        });
    
        res.status(200).json({ success: true, data: transactions });
      } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: error.message });
      }
    
});



module.exports = router;