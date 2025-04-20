const express = require('express');
const router = express.Router();
const { users, vehicles, vehicleWishlist, LostAndFound, rental, Transaction, sequelize } = require('../../db/sequelize');

// Dashboard Summary Route
router.get('/dashboard/summary', async (req, res) => {
  try {
    // 1. Total Users
    const totalUsers = await users.count();

    // 2. Total Vehicles for Sell
    const totalSellVehicles = await vehicles.count();

    // 3. Total Rental Vehicles
    const totalRentalVehicles = await rental.count();

    // 4. Total Bookings and Active Bookings
    const totalBookings = await vehicleWishlist.count();
    const activeBookings = await vehicleWishlist.count({ where: { status: 'active' } });

    // 5. Lost and Found Separate Count
    const totalLost = await LostAndFound.count({ where: { status: 'lost' } });
    const totalFound = await LostAndFound.count({ where: { status: 'found' } });

    // 6. 5 Most Recent Transactions
    const recentTransactions = await Transaction.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    // 7. Total Earning (sum of amounts in transactions)
    const totalEarningsResult = await Transaction.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'totalEarnings']],
      raw: true,
    });

    const totalEarnings = parseFloat(totalEarningsResult.totalEarnings || 0);

    res.json({
      totalUsers,
      totalSellVehicles,
      totalRentalVehicles,
      totalBookings,
      activeBookings,
      totalLost,
      totalFound,
      recentTransactions,
      totalEarnings,
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ error: "Failed to load dashboard summary" });
  }
});

module.exports = router;
