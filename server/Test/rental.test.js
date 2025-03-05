const request = require('supertest');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db/sequelize');
const router = require('../controllers/rentControllers/rental');

// Create test Express app
const app = express();
app.use(express.json());
app.use('/', router);

// Mock Multer
jest.mock('multer', () => {
  const m = {
    diskStorage: jest.fn().mockImplementation(() => ({
      _handleFile: jest.fn(),
      _removeFile: jest.fn()
    })),
    fileFilter: jest.fn(),
    single: jest.fn().mockReturnValue((req, res, next) => {
      req.file = {
        filename: 'test-license.jpg',
        path: '/uploads/licenses/test-license.jpg'
      };
      next();
    })
  };
  return () => m;
});

// Mock Sequelize models
jest.mock('../db/sequelize', () => ({
  Vehicle: {
    findByPk: jest.fn()
  },
  vehicles: {
    findByPk: jest.fn()
  },
  RentalAllVehicles: {
    findByPk: jest.fn()
  },
  rental: {
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn()
  },
  Transaction: {
    create: jest.fn(),
    findOne: jest.fn()
  },
  users: {}
}));

// Mock request module
jest.mock('request', () => {
  return jest.fn().mockImplementation((options, callback) => {
    callback(null, { statusCode: 200 }, JSON.stringify({
      pidx: 'test-pidx',
      payment_url: 'https://test-payment-url.com'
    }));
  });
});

// Mock file system
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
  mkdirSync: jest.fn(),
  unlink: jest.fn()
}));

describe('Rental Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /', () => {
    it('should create a new rental with payLater option', async () => {
      const mockVehicle = { id: 1, make: 'Toyota', model: 'Corolla' };
      const mockRental = { id: 1, toJSON: () => ({ id: 1 }) };
      db.vehicles.findByPk.mockResolvedValue(mockVehicle);
      db.rental.create.mockResolvedValue(mockRental);

      const res = await request(app)
        .post('/')
        .field('vehicleId', '1')
        .field('userId', '123')
        .field('pickupLocation', 'Test Location')
        .field('pickupDate', '2023-01-01')
        .field('returnDate', '2023-01-02')
        .field('totalAmount', '100')
        .field('paymentMethod', 'payLater')
        .attach('licenseImage', Buffer.from('test'), 'test.jpg');

      
      
      
    });

    it('should create a new rental with Khalti payment', async () => {
      const mockVehicle = { id: 1, make: 'Toyota', model: 'Corolla' };
      const mockRental = { id: 1 };
      db.vehicles.findByPk.mockResolvedValue(mockVehicle);
      db.rental.create.mockResolvedValue(mockRental);

      const res = await request(app)
        .post('/')
        .field('vehicleId', '1')
        .field('userId', '123')
        .field('pickupLocation', 'Test Location')
        .field('pickupDate', '2023-01-01')
        .field('returnDate', '2023-01-02')
        .field('totalAmount', '100')
        .field('paymentMethod', 'khalti')
        .attach('licenseImage', Buffer.from('test'), 'test.jpg');

      
    });

   
  });

  describe('GET /:id', () => {
    it('should fetch a rental record', async () => {
      const mockRental = {
        id: 1,
        toJSON: () => ({ id: 1 }),
        metadata: JSON.stringify({ vehicleType: 'regular' }),
        user: { id: 1 }
      };
      const mockVehicle = { id: 1, make: 'Toyota' };
      db.rental.findByPk.mockResolvedValue(mockRental);
      db.vehicles.findByPk.mockResolvedValue(mockVehicle);

      const res = await request(app).get('/1');

      expect(res.statusCode).toBe(200);
      expect(db.rental.findByPk).toHaveBeenCalledWith('1', {
        include: [{ model: db.users, as: 'user' }]
      });
    });

    it('should handle rental not found', async () => {
      db.rental.findByPk.mockResolvedValue(null);

      const res = await request(app).get('/999');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /cancel/:id', () => {
    it('should cancel a rental', async () => {
      const mockRental = {
        id: 1,
        status: 'pending',
        save: jest.fn()
      };
      const mockTransaction = {
        id: 1,
        status: 'pending',
        save: jest.fn()
      };
      db.rental.findByPk.mockResolvedValue(mockRental);
      db.Transaction.findOne.mockResolvedValue(mockTransaction);

      const res = await request(app).put('/cancel/1');

      expect(res.statusCode).toBe(200);
      expect(mockRental.status).toBe('cancelled');
      expect(mockTransaction.status).toBe('cancelled');
    });
  });

  describe('PUT /update/:id', () => {
    it('should update a rental status', async () => {
      const mockRental = {
        id: 1,
        status: 'pending',
        save: jest.fn()
      };
      const mockTransaction = {
        id: 1,
        status: 'pending',
        save: jest.fn()
      };
      db.rental.findByPk.mockResolvedValue(mockRental);
      db.Transaction.findOne.mockResolvedValue(mockTransaction);

      const res = await request(app)
        .put('/update/1')
        .send({ status: 'completed' });

      expect(res.statusCode).toBe(200);
      expect(mockRental.status).toBe('completed');
      expect(mockTransaction.status).toBe('paid');
    });
  });
});