const express = require('express');
const {
  getNotifications,
  getBookings,
  getWishlist,
  getWishlistStatus,
  getLostAndFound,
  getTransactions,
  getTopSellingModels,
} = require('../controllers/dashboardControllers/dashboard');

const router = express.Router();

router.get('/notifications', getNotifications);
router.get('/bookings', getBookings);
router.get('/wishlist', getWishlist);
router.get('/wishlist/status', getWishlistStatus);
router.get('/lostandfound', getLostAndFound);
router.get('/transactions', getTransactions);
router.get('/topsellingmodels', getTopSellingModels);

module.exports = router;
