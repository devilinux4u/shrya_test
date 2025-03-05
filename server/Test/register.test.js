const request = require('supertest');
const express = require('express');
const authRouter = require('../controllers/authControllers/register'); // Adjust path as needed
const { users } = require('../db/sequelize');
const { enc } = require('../helpers/hash');
const sendOtp = require('../helpers/sendOtp');

// Create test Express app
const testApp = express();
testApp.use(express.json());
testApp.use('/', authRouter);

// Mock dependencies
jest.mock('../db/sequelize', () => ({
  users: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock('../helpers/hash', () => ({
  enc: jest.fn().mockImplementation(password => `hashed_${password}`)
}));

jest.mock('../helpers/sendOtp', () => jest.fn());

describe('Authentication Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    const mockUserData = {
      name: 'Test User',
      user: 'testuser',
      email: 'test@example.com',
      number: '1234567890',
      pass: 'password123'
    };

    it('should register a new user successfully', async () => {
      // Mock no existing users
      users.findOne.mockResolvedValue(null);
      
      // Mock created user
      const mockUser = {
        id: 1,
        ...mockUserData,
        pass: 'hashed_password123',
        otp: 123456,
        verified: false
      };
      users.create.mockResolvedValue(mockUser);

      const res = await request(testApp)
        .post('/register')
        .send(mockUserData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(users.create).toHaveBeenCalledWith({
        fname: 'Test User',
        uname: 'testuser',
        email: 'test@example.com',
        num: '1234567890',
        pass: 'hashed_password123',
        otp: expect.any(Number),
        verified: false
      });
      expect(sendOtp).toHaveBeenCalledWith('test@example.com', expect.any(Number));
    });

    it('should reject duplicate username', async () => {
      users.findOne.mockResolvedValueOnce({ uname: 'testuser' });

      const res = await request(testApp)
        .post('/register')
        .send(mockUserData);

      expect(res.body).toEqual({
        success: false,
        msg: 'Username already exists'
      });
    });

    it('should reject duplicate email', async () => {
      users.findOne
        .mockResolvedValueOnce(null) // No existing username
        .mockResolvedValueOnce({ email: 'test@example.com' }); // Existing email

      const res = await request(testApp)
        .post('/register')
        .send(mockUserData);

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
        .post('/register')
        .send(mockUserData);

      expect(res.body).toEqual({
        success: false,
        msg: 'Number already registered'
      });
    });

    it('should handle registration errors', async () => {
      users.findOne.mockRejectedValue(new Error('DB error'));

      const res = await request(testApp)
        .post('/register')
        .send(mockUserData);

      expect(res.body).toEqual({
        success: false,
        msg: 'An error occurred'
      });
    });
  });

  describe('POST /verify-otp', () => {
    const mockVerificationData = {
      userId: 1,
      otp: '123456'
    };

    it('should verify OTP successfully', async () => {
      const mockUser = {
        id: 1,
        otp: 123456,
        verified: false
      };

      users.findOne.mockResolvedValue(mockUser);
      users.update.mockResolvedValue([1]); // update returns [numberOfAffectedRows]

      const res = await request(testApp)
        .post('/verify-otp')
        .send(mockVerificationData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        msg: 'OTP verified successfully'
      });
      expect(users.update).toHaveBeenCalledWith(
        { verified: true },
        { where: { id: 1 } }
      );
    });

    it('should reject invalid user', async () => {
      users.findOne.mockResolvedValue(null);

      const res = await request(testApp)
        .post('/verify-otp')
        .send(mockVerificationData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        msg: 'User not found'
      });
    });

    it('should reject invalid OTP', async () => {
      const mockUser = {
        id: 1,
        otp: 654321, // Different from sent OTP
        verified: false
      };

      users.findOne.mockResolvedValue(mockUser);

      const res = await request(testApp)
        .post('/verify-otp')
        .send(mockVerificationData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        msg: 'Invalid OTP'
      });
    });

    it('should handle verification errors', async () => {
      users.findOne.mockRejectedValue(new Error('DB error'));

      const res = await request(testApp)
        .post('/verify-otp')
        .send(mockVerificationData);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        success: false,
        msg: 'An error occurred'
      });
    });
  });
});