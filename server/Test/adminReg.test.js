const request = require('supertest');
const express = require('express');
const adminUsersRouter = require('../controllers/authControllers/adminReg'); // Adjust path as needed
const { users } = require('../db/sequelize');
const { enc } = require('../helpers/hash');

// Create test Express app
const testApp = express();
testApp.use(express.json());
testApp.use('/', adminUsersRouter); // Mount at root since routes include /admin prefix

// Mock Sequelize models and helpers
jest.mock('../db/sequelize', () => ({
  users: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn()
  }
}));

jest.mock('../helpers/hash', () => ({
  enc: jest.fn().mockImplementation(pass => `hashed_${pass}`)
}));

describe('Admin User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /admin/register', () => {
    const mockUserData = {
      fname: 'Admin',
      uname: 'admin123',
      email: 'admin@example.com',
      num: '1234567890',
      password: 'secure123'
    };

    it('should register a new admin successfully', async () => {
      users.findOne.mockResolvedValue(null); // No existing user
      users.create.mockResolvedValue({
        id: 1,
        ...mockUserData,
        pass: 'hashed_secure123',
        otp: 123456,
        verified: true
      });

      const res = await request(testApp)
        .post('/admin/register')
        .send(mockUserData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(users.create).toHaveBeenCalledWith({
        fname: 'Admin',
        uname: 'admin123',
        email: 'admin@example.com',
        num: '1234567890',
        pass: 'hashed_secure123',
        otp: expect.any(Number),
        verified: true
      });
    });

    it('should reject duplicate username', async () => {
      users.findOne.mockResolvedValueOnce({ uname: 'admin123' }); // Existing username

      const res = await request(testApp)
        .post('/admin/register')
        .send(mockUserData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: false,
        msg: 'Username already exists'
      });
    });

    it('should reject duplicate email', async () => {
      users.findOne
        .mockResolvedValueOnce(null) // No existing username
        .mockResolvedValueOnce({ email: 'admin@example.com' }); // Existing email

      const res = await request(testApp)
        .post('/admin/register')
        .send(mockUserData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: false,
        msg: 'Email already registered'
      });
    });

    it('should reject duplicate phone number', async () => {
      users.findOne
        .mockResolvedValueOnce(null) // No existing username
        .mockResolvedValueOnce(null) // No existing email
        .mockResolvedValueOnce({ num: '1234567890' }); // Existing phone

      const res = await request(testApp)
        .post('/admin/register')
        .send(mockUserData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: false,
        msg: 'Number already registered'
      });
    });

    it('should handle server errors', async () => {
      users.findOne.mockRejectedValue(new Error('DB error'));

      const res = await request(testApp)
        .post('/admin/register')
        .send(mockUserData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: false,
        msg: 'An error occurred'
      });
    });
  });

  describe('GET /users/all', () => {
    it('should fetch all users successfully', async () => {
      const mockUsers = [
        {
          id: 1,
          fname: 'User1',
          uname: 'user1',
          email: 'user1@example.com',
          num: '1111111111',
          profile: null,
          createdAt: '2023-01-01'
        },
        {
          id: 2,
          fname: 'User2',
          uname: 'user2',
          email: 'user2@example.com',
          num: '2222222222',
          profile: null,
          createdAt: '2023-01-02'
        }
      ];

      users.findAll.mockResolvedValue(mockUsers);

      const res = await request(testApp).get('/users/all');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: mockUsers
      });
      expect(users.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'fname', 'uname', 'email', 'num', 'profile', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });
    });

    it('should handle errors when fetching users', async () => {
      users.findAll.mockRejectedValue(new Error('DB error'));

      const res = await request(testApp).get('/users/all');

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        success: false,
        message: 'Failed to fetch users',
        error: 'DB error'
      });
    });
  });

  describe('DELETE /admin/user/delete/:id', () => {
    it('should delete a user successfully', async () => {
      const mockUser = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      users.findByPk.mockResolvedValue(mockUser);

      const res = await request(testApp).delete('/admin/user/delete/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: 'User deleted successfully'
      });
      expect(mockUser.destroy).toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      users.findByPk.mockResolvedValue(null);

      const res = await request(testApp).delete('/admin/user/delete/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: 'User not found'
      });
    });

    it('should handle errors when deleting user', async () => {
      users.findByPk.mockRejectedValue(new Error('DB error'));

      const res = await request(testApp).delete('/admin/user/delete/1');

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        success: false,
        message: 'Failed to delete user',
        error: 'DB error'
      });
    });
  });
});