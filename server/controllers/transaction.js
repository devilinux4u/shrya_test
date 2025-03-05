const express = require('express');
const router = express.Router();
const { Transaction, rental, users, RentalAllVehicles } = require('../db/sequelize');

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
            },
            {
              model: RentalAllVehicles, 
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
   
    const totalAmount = transactions
      .filter((trx) => trx.status === "paid")
      .reduce((sum, trx) => sum + trx.amount, 0);

    const pendingAmount = transactions
      .filter((trx) => trx.status === "pending")
      .reduce((sum, trx) => sum + trx.amount, 0);

    const cancelledAmount = transactions
      .filter((trx) => trx.status === "cancelled")
      .reduce((sum, trx) => sum + trx.amount, 0);

    const completedAmount = transactions
      .filter((trx) => trx.status === "paid")
      .reduce((sum, trx) => sum + trx.amount, 0);

    res.status(200).json({
      success: true,
      data: transactions,
      totalAmount,
      pendingAmount,
      cancelledAmount,
      completedAmount
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: error.message });
  }
});

module.exports = router;