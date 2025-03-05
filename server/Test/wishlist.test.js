const request = require('supertest');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { vehicleWishlist, wishlistImage, users } = require('../db/sequelize');
const notify = require('../helpers/wishNotify');
const wishCancelNotify = require('../helpers/wishCancelNotify');

// Create test Express app
const app = express();
const router = require('../controllers/vehicleControllers/wishlist');
app.use(express.json());
app.use('/', router);

// Mock Multer properly
jest.mock('multer', () => {
  const m = {
    diskStorage: jest.fn().mockImplementation(() => ({
      _handleFile: jest.fn(),
      _removeFile: jest.fn()
    })),
    fileFilter: jest.fn(),
    array: jest.fn().mockImplementation(() => (req, res, next) => {
      req.files = [{
        filename: 'test-image.jpg',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg'
      }];
      next();
    })
  };
  return () => m;
});

// Mock Sequelize models
jest.mock('../db/sequelize', () => ({
  vehicleWishlist: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  wishlistImage: {
    bulkCreate: jest.fn(),
    destroy: jest.fn()
  },
  users: {
    findByPk: jest.fn()
  }
}));

// Mock notification helpers
jest.mock('../helpers/wishNotify', () => jest.fn());
jest.mock('../helpers/wishCancelNotify', () => jest.fn());

// Mock file system
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
  mkdirSync: jest.fn(),
  unlinkSync: jest.fn()
}));

describe('Wishlist Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /wishlist/:userId', () => {
    it('should fetch wishlists for a user', async () => {
      const mockWishlists = [{
        id: 1,
        uid: 123,
        images: [{ id: 1, imageUrl: '/uploads/test.jpg' }]
      }];
      vehicleWishlist.findAll.mockResolvedValue(mockWishlists);

      const res = await request(app).get('/wishlist/123');

      expect(res.statusCode).toBe(200);
      expect(vehicleWishlist.findAll).toHaveBeenCalledWith({
        where: { uid: '123' },
        include: [{
          model: wishlistImage,
          as: 'images',
          attributes: ['id', 'imageUrl']
        }],
        order: [['createdAt', 'DESC']]
      });
    });
  });

  describe('DELETE /wishlist/:wishlistId', () => {
    it('should delete a wishlist item', async () => {
      const mockWishlist = {
        id: 1,
        images: [{ id: 1, imageUrl: '/uploads/test.jpg', destroy: jest.fn() }],
        destroy: jest.fn()
      };
      vehicleWishlist.findByPk.mockResolvedValue(mockWishlist);

      const res = await request(app).delete('/wishlist/1');

      expect(res.statusCode).toBe(200);
      
      expect(mockWishlist.destroy).toHaveBeenCalled();
    });
  });

  

  describe('PUT /wishlist/edit/:wishlistId', () => {
    it('should update a wishlist item', async () => {
      const mockWishlist = {
        id: 1,
        update: jest.fn()
      };
      vehicleWishlist.findByPk.mockResolvedValue(mockWishlist);

      const res = await request(app)
        .put('/wishlist/edit/1')
        .send({ make: 'Updated Make' });

      expect(res.statusCode).toBe(200);
      expect(mockWishlist.update).toHaveBeenCalled();
    });
  });

  describe('GET /admin/wishlist/all', () => {
    it('should fetch all wishlists for admin', async () => {
      const mockWishlists = [{
        id: 1,
        images: [{ id: 1, imageUrl: '/uploads/test.jpg' }],
        user: { fname: 'Admin', num: '123', email: 'admin@test.com' }
      }];
      vehicleWishlist.findAll.mockResolvedValue(mockWishlists);

      const res = await request(app).get('/admin/wishlist/all');

      expect(res.statusCode).toBe(200);
      expect(vehicleWishlist.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: wishlistImage,
            as: 'images',
            attributes: ['id', 'imageUrl']
          },
          {
            model: users,
            as: 'user',
            attributes: ['fname', 'num', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    });
  });

  describe('PUT /wishlist/:id/available', () => {
    it('should mark wishlist as available and notify', async () => {
      const mockWishlist = {
        id: 1,
        status: 'pending',
        save: jest.fn(),
        user: { email: 'test@test.com', fname: 'Test' }
      };
      vehicleWishlist.findOne.mockResolvedValue(mockWishlist);

      const res = await request(app).put('/wishlist/1/available');

      expect(res.statusCode).toBe(200);
      expect(mockWishlist.status).toBe('available');
      expect(notify).toHaveBeenCalled();
    });
  });

  describe('PUT /wishlist/:id/cancel', () => {
    it('should cancel wishlist and notify', async () => {
      const mockWishlist = {
        id: 1,
        status: 'pending',
        save: jest.fn(),
        uid: 123,
        make: 'Toyota',
        model: 'Corolla',
        year: 2020
      };
      const mockUser = {
        email: 'test@test.com',
        fname: 'Test'
      };
      vehicleWishlist.findOne.mockResolvedValue(mockWishlist);
      users.findByPk.mockResolvedValue(mockUser);

      const res = await request(app)
        .put('/wishlist/1/cancel')
        .send({ reason: 'Test reason' });

      expect(res.statusCode).toBe(200);
      expect(mockWishlist.status).toBe('cancelled');
      expect(wishCancelNotify).toHaveBeenCalled();
    });
  });
});