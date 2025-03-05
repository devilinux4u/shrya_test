const express = require('express');
const router = express.Router();
const { users, vehicles, vehicleWishlist, LostAndFound, rental, RentalAllVehicles, Transaction, sequelize } = require('../../db/sequelize');
const { Op } = require('sequelize');

// Dashboard Summary Route
router.get('/dashboard/summary', async (req, res) => {
  try {
    // 1. Total Users
    const totalUsers = await users.count();

    // 2. Total Vehicles for Sell
    const totalSellVehicles = await vehicles.count();

    // 3. Total Rental Vehicles
    const totalRentalVehicles = await RentalAllVehicles.count();

    // 4. Total Bookings and Active Bookings
    const totalBookings = await rental.count({
      where: {
        status: {
          [Op.in]: ['active', 'pending', 'late']
        }
      } 
    });
    const activeBookings = await rental.count({ where: { status: 'active' } });
    const pendingBookings = await rental.count({ where: { status: 'pending' } });
    const lateBookings = await rental.count({ where: { status: 'late' } });



    // 5. Lost and Found Separate Count
    const totalLost = await LostAndFound.count({ where: { type: 'lost' } });
    const totalFound = await LostAndFound.count({ where: { type: 'found' } });

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

    //wishlist stsus
    const statusCounts = await vehicleWishlist.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'value']
      ],
      group: ['status'],
      raw: true
    });

    // Updated color mapping
    const statusColorMap = {
      'Available': '#10B981',
      'Pending': '#F59E0B',
      'Cancelled': '#EF4444'
    };

    const wishlistStatus = statusCounts.map(item => ({
      name: item.status,
      value: parseInt(item.value),
      color: statusColorMap[item.status] || '#6B7280' // default gray if not mapped
    }));


    //top selling
    const statusCount = await rental.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    const overview = statusCount.map(item => ({
      status: item.status,
      count: item.dataValues.count
    }));


    res.json({
      totalUsers,
      totalSellVehicles,
      totalRentalVehicles,
      totalBookings,
      activeBookings,
      pendingBookings,
      lateBookings,
      totalLost,
      totalFound,
      recentTransactions,
      totalEarnings,
      wishlistStatus,
      overview
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ error: "Failed to load dashboard summary" });
  }
});

module.exports = router;
