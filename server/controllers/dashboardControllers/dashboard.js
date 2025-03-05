const { users, vehicles, vehicleWishlist, LostAndFound, rental, Transaction } = require('../../db/sequelize');

const getNotifications = async (req, res) => {
  try {
    // Example: Fetch notifications from a hypothetical notifications table
    const notifications = []; // Replace with actual query
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const getBookings = async (req, res) => {
  try {
    const total = await rental.count();
    const active = await rental.count({ where: { status: 'active' } });
    const pending = await rental.count({ where: { status: 'pending' } });
    res.json({ total, active, pending });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await vehicleWishlist.findAll();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

const getWishlistStatus = async (req, res) => {
  try {
    const statuses = await vehicleWishlist.findAll({
      attributes: ['status', [sequelize.fn('COUNT', 'status'), 'count']],
      group: ['status'],
    });
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist status' });
  }
};

const getLostAndFound = async (req, res) => {
  try {
    const total = await LostAndFound.count();
    const lost = await LostAndFound.count({ where: { status: 'lost' } });
    const found = await LostAndFound.count({ where: { status: 'found' } });
    res.json({ total, lost, found });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lost and found data' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [{ model: rental, as: 'booking' }],
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const getTopSellingModels = async (req, res) => {
  try {
    const topSellingModels = await vehicles.findAll({
      attributes: ['model', [sequelize.fn('COUNT', 'model'), 'sales']],
      group: ['model'],
      order: [[sequelize.fn('COUNT', 'model'), 'DESC']],
      limit: 5,
    });
    res.json(topSellingModels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top-selling models' });
  }
};

module.exports = {
  getNotifications,
  getBookings,
  getWishlist,
  getWishlistStatus,
  getLostAndFound,
  getTransactions,
  getTopSellingModels,
};
