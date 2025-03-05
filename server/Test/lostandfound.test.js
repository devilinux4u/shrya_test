const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { LostAndFound, LostAndFoundImage, users } = require('../db/sequelize');

// Create test Express app
const app = express();
const router = require('../controllers/lostAndFoundControllers/lostAndFound');
app.use(express.json());
app.use('/', router);

// Mock Multer properly


// Mock Sequelize models
jest.mock('../db/sequelize', () => ({
  LostAndFound: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn()
  },
  LostAndFoundImage: {
    create: jest.fn(),
    destroy: jest.fn().mockResolvedValue(1) // Ensure it resolves properly
  },
  users: {}
}));

// Mock file system
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
  mkdirSync: jest.fn()
}));

describe('Lost & Found Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  

  describe('GET /all', () => {
    it('should fetch all active reports with images and user info', async () => {
      const mockReports = [{
        id: 1,
        status: 'active',
        images: [],
        user: { fname: 'John', num: '1234567890', id: 1 }
      }];
      LostAndFound.findAll.mockResolvedValue(mockReports);

      const res = await request(app).get('/all');

      expect(res.statusCode).toBe(200);
      expect(LostAndFound.findAll).toHaveBeenCalledWith({
        where: { status: 'active' },
        include: [
          { model: LostAndFoundImage, as: 'images' },
          { model: users, as: 'user', attributes: ['fname', 'num', 'id'] }
        ],
        order: [['createdAt', 'DESC']]
      });
    });
  });

  describe('GET /admin/all', () => {
    it('should fetch all reports for admin', async () => {
      const mockReports = [{
        id: 1,
        images: [],
        user: { fname: 'Admin', num: '9876543210', role: 'admin' }
      }];
      LostAndFound.findAll.mockResolvedValue(mockReports);

      const res = await request(app).get('/admin/all');

      expect(res.statusCode).toBe(200);
      expect(LostAndFound.findAll).toHaveBeenCalledWith({
        include: [
          { model: LostAndFoundImage, as: 'images' },
          { model: users, as: 'user', attributes: ['fname', 'num', 'role'] }
        ],
        order: [['createdAt', 'DESC']]
      });
    });
  });

  describe('GET /all2/:id', () => {
    it('should fetch reports for specific user', async () => {
      const mockReports = [{
        id: 1,
        uid: 123,
        images: [],
        user: { fname: 'User', num: '1111111111' }
      }];
      LostAndFound.findAll.mockResolvedValue(mockReports);

      const res = await request(app).get('/all2/123');

      expect(res.statusCode).toBe(200);
      expect(LostAndFound.findAll).toHaveBeenCalledWith({
        where: { uid: '123' },
        include: [
          { model: LostAndFoundImage, as: 'images' },
          { model: users, as: 'user', attributes: ['fname', 'num'] }
        ],
        order: [['createdAt', 'DESC']]
      });
    });
  });

  describe('PUT /resolve/:id', () => {
    it('should mark report as resolved', async () => {
      const mockReport = {
        id: 1,
        status: 'active',
        save: jest.fn()
      };
      LostAndFound.findByPk.mockResolvedValue(mockReport);

      const res = await request(app).put('/resolve/1');

      expect(res.statusCode).toBe(200);
      expect(mockReport.status).toBe('resolved');
      expect(mockReport.save).toHaveBeenCalled();
    });

    it('should handle report not found', async () => {
      LostAndFound.findByPk.mockResolvedValue(null);

      const res = await request(app).put('/resolve/999');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /edit/:itemId', () => {
    it('should update report details', async () => {
      const mockReport = {
        id: 1,
        title: 'Old Title',
        save: jest.fn()
      };
      LostAndFound.findByPk.mockResolvedValue(mockReport);

      const res = await request(app)
        .put('/edit/1')
        .send({ title: 'New Title' });

      expect(res.statusCode).toBe(200);
      expect(mockReport.title).toBe('New Title');
      expect(mockReport.save).toHaveBeenCalled();
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a report and its images', async () => {
      const mockReport = {
        id: 1,
        destroy: jest.fn()
      };
      LostAndFound.findByPk.mockResolvedValue(mockReport);
      LostAndFoundImage.destroy.mockResolvedValue(1); // Mock destroy to resolve correctly

      const res = await request(app).delete('/1');

      expect(res.statusCode).toBe(200);
      
    });
  });
});