const request = require('supertest');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sequelize, vehicles, v_img, users } = require('../db/sequelize');

// Create test Express app
const app = express();
const router = require('../controllers/vehicleControllers/sellVechile');
app.use(express.json());
app.use('/', router);

// Properly mock Multer with memoryStorage
jest.mock('multer', () => {
  const m = {
    memoryStorage: jest.fn(() => ({
      _handleFile: jest.fn(),
      _removeFile: jest.fn()
    })),
    array: jest.fn().mockReturnValue((req, res, next) => {
      req.files = [{
        buffer: Buffer.from('test'),
        originalname: 'test.jpg'
      }];
      next();
    })
  };
  return () => m;
});

// Mock Sequelize models
jest.mock('../db/sequelize', () => ({
  sequelize: {
    literal: jest.fn().mockReturnValue('RAND()')
  },
  vehicles: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  v_img: {
    create: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn()
  },
  users: {}
}));

// Mock file system
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn()
}));

describe('Vehicle Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

    it('should handle errors during vehicle creation', async () => {
      vehicles.create.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .post('/addVehicle')
        .send({ id: 123, title: 'Test Vehicle' });

      
    });
  });

  describe('GET /vehicles/random', () => {
    it('should fetch a random available vehicle', async () => {
      const mockVehicle = {
        id: 1,
        status: 'available',
        SellVehicleImages: [{ id: 1, image: '/uploads/1/test.jpg' }],
        toJSON: jest.fn().mockReturnValue({ id: 1 })
      };
      vehicles.findOne.mockResolvedValue(mockVehicle);

      const res = await request(app).get('/vehicles/random');

      expect(res.statusCode).toBe(200);
      expect(vehicles.findOne).toHaveBeenCalledWith({
        where: { status: "available" },
        order: 'RAND()',
        include: [{ model: v_img, attributes: ["id", "image"] }]
      });
    });
  });

  describe('GET /vehicles/six', () => {
    it('should fetch six random available vehicles', async () => {
      const mockVehicles = [{
        id: 1,
        SellVehicleImages: [{ id: 1, image: '/uploads/1/test.jpg' }],
        toJSON: jest.fn().mockReturnValue({ id: 1 })
      }];
      vehicles.findAll.mockResolvedValue(mockVehicles);

      const res = await request(app).get('/vehicles/six');

      expect(res.statusCode).toBe(200);
      expect(vehicles.findAll).toHaveBeenCalledWith({
        where: { status: "available" },
        order: 'RAND()',
        limit: 6,
        include: [{ model: v_img, attributes: ["id", "image"] }]
      });
    });
  });

  describe('GET /vehicles/all', () => {
    it('should fetch all available vehicles', async () => {
      const mockVehicles = [{
        id: 1,
        SellVehicleImages: [{ id: 1, image: '/uploads/1/test.jpg' }],
        toJSON: jest.fn().mockReturnValue({ id: 1 })
      }];
      vehicles.findAll.mockResolvedValue(mockVehicles);

      const res = await request(app).get('/vehicles/all');

      expect(res.statusCode).toBe(200);
      expect(vehicles.findAll).toHaveBeenCalledWith({
        where: { status: "available" },
        order: 'RAND()',
        include: [
          { model: v_img, attributes: ["id", "image"] },
          { model: users, as: "user", attributes: ["fname"] }
        ]
      });
    });
  });

  describe('GET /vehicles/admin/all', () => {
    it('should fetch all vehicles for admin', async () => {
      const mockVehicles = [{
        id: 1,
        SellVehicleImages: [{ id: 1, image: '/uploads/1/test.jpg' }],
        toJSON: jest.fn().mockReturnValue({ id: 1 })
      }];
      vehicles.findAll.mockResolvedValue(mockVehicles);

      const res = await request(app).get('/vehicles/admin/all');

      expect(res.statusCode).toBe(200);
      expect(vehicles.findAll).toHaveBeenCalledWith({
        order: 'RAND()',
        include: [
          { model: v_img, attributes: ["id", "image"] },
          { model: users, as: "user", attributes: ["role", "fname"] }
        ]
      });
    });
  });

  describe('GET /vehicles/one/:vid', () => {
    it('should fetch a specific vehicle', async () => {
      const mockVehicle = {
        id: 1,
        SellVehicleImages: [{ id: 1, image: '/uploads/1/test.jpg' }],
        toJSON: jest.fn().mockReturnValue({ id: 1 })
      };
      vehicles.findOne.mockResolvedValue(mockVehicle);

      const res = await request(app).get('/vehicles/one/1');

      expect(res.statusCode).toBe(200);
      expect(vehicles.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        include: [
          { model: v_img, as: "SellVehicleImages", attributes: ["id", "image"] },
          { model: users, as: "user", attributes: ["id", "fname", "uname", "email", "num"] }
        ]
      });
    });
  });

  describe('DELETE /vehicles/delete/:id', () => {
    it('should delete a vehicle and its images', async () => {
      const mockVehicle = { id: 1, destroy: jest.fn() };
      const mockImages = [{ id: 1, image: '/uploads/1/test.jpg', destroy: jest.fn() }];
      vehicles.findByPk.mockResolvedValue(mockVehicle);
      v_img.findAll.mockResolvedValue(mockImages);

      const res = await request(app).delete('/vehicles/delete/1');

      expect(res.statusCode).toBe(200);
      
      expect(mockVehicle.destroy).toHaveBeenCalled();
    });
  });

  describe('PUT /vehicles/edit/:id', () => {
    it('should update a vehicle', async () => {
      const mockVehicle = { id: 1, update: jest.fn() };
      vehicles.findByPk.mockResolvedValue(mockVehicle);

      const res = await request(app)
        .put('/vehicles/edit/1')
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toBe(200);
      expect(mockVehicle.update).toHaveBeenCalledWith({ title: 'Updated Title' });
    });
  });

  describe('PUT /vehicles/sold/:id', () => {
    it('should mark a vehicle as sold', async () => {
      const mockVehicle = { id: 1, status: 'available', save: jest.fn() };
      vehicles.findByPk.mockResolvedValue(mockVehicle);

      const res = await request(app).put('/vehicles/sold/1');

      expect(res.statusCode).toBe(200);
      expect(mockVehicle.status).toBe('sold');
      expect(mockVehicle.save).toHaveBeenCalled();
    });
  });

  describe('GET /vehicles/user/all/:uid', () => {
    it('should fetch vehicles for a specific user', async () => {
      const mockVehicles = [{
        id: 1,
        SellVehicleImages: [{ id: 1, image: '/uploads/1/test.jpg' }],
        toJSON: jest.fn().mockReturnValue({ id: 1 })
      }];
      vehicles.findAll.mockResolvedValue(mockVehicles);

      const res = await request(app).get('/vehicles/user/all/123');

      expect(res.statusCode).toBe(200);
      expect(vehicles.findAll).toHaveBeenCalledWith({
        where: { uid: '123' },
        include: [{ model: v_img, attributes: ["id", "image"] }]
      });
    });
  });

  describe('GET /book/:id', () => {
    it('should fetch booking details for a vehicle', async () => {
      const mockVehicle = { id: 1 };
      vehicles.findByPk.mockResolvedValue(mockVehicle);

      const res = await request(app).get('/book/1');

      expect(res.statusCode).toBe(200);
      
    });
  });