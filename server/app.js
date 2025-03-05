const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardControllers/dashboard');

router.get('/notifications', dashboardController.getNotifications);
router.get('/bookings', dashboardController.getBookings);
router.get('/wishlist', dashboardController.getWishlist);
router.get('/wishlist/status', dashboardController.getWishlistStatus);
router.get('/lostandfound', dashboardController.getLostAndFound);
router.get('/transactions', dashboardController.getTransactions);
router.get('/topsellingmodels', dashboardController.getTopSellingModels);

module.exports = router;