const request = require('supertest');
const express = require('express');
const authRouter = require('../controllers/authControllers/login');
const { users } = require('../db/sequelize');
const { enc, dec } = require('../helpers/hash');
const sendOtp = require('../helpers/sendOtp');

// Create test Express app
const testApp = express();
testApp.use(express.json());
testApp.use('/', authRouter);

// Mock dependencies
jest.mock('../db/sequelize', () => ({
  users: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('../helpers/hash', () => ({
  enc: jest.fn().mockImplementation(text => `encrypted_${text}`),
  dec: jest.fn().mockImplementation((input, hash) => input === 'correct_password')
}));

jest.mock('../helpers/sendOtp', () => jest.fn());

// Mock Google Auth Library properly
jest.mock('google-auth-library', () => {
  const mockVerifyIdToken = jest.fn();
  
  return {
    OAuth2Client: jest.fn(() => ({
      verifyIdToken: mockVerifyIdToken
    })),
    mockVerifyIdToken
  };
});

// Get the mocked verifyIdToken function
const { mockVerifyIdToken } = require('google-auth-library');

describe('Authentication Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /login', () => {
    it('should authenticate admin user successfully', async () => {
      const mockAdminUser = {
        id: 1,
        uname: 'ShreyaAuto',
        fname: 'Shreya Auto',
        pass: 'ShreyaAuto'
      };

      users.findOne.mockResolvedValue(mockAdminUser);

      const res = await request(testApp)
        .post('/login')
        .send({ user: 'ShreyaAuto', pass: 'ShreyaAuto' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        msg: 'itsadmin',
        cok: `1-encrypted_ShreyaAuto-Shreya Auto`
      });
    });

    it('should create admin user if not exists', async () => {
      users.findOne.mockResolvedValueOnce(null);
      const mockAdminUser = {
        id: 1,
        uname: 'ShreyaAuto',
        fname: 'Shreya Auto'
      };
      users.create.mockResolvedValue(mockAdminUser);

      const res = await request(testApp)
        .post('/login')
        .send({ user: 'ShreyaAuto', pass: 'ShreyaAuto' });

      expect(users.create).toHaveBeenCalledWith({
        fname: 'Shreya Auto',
        uname: 'ShreyaAuto',
        email: 'noreply.shreyaauto@gmail.com',
        num: '9841594067',
        pass: 'ShreyaAuto',
        role: 'admin',
        profile: null,
        otp: 123,
        verified: true
      });
      expect(res.body.success).toBe(true);
    });

    it('should return user not found for invalid username', async () => {
      users.findOne.mockResolvedValue(null);

      const res = await request(testApp)
        .post('/login')
        .send({ user: 'invalid', pass: 'password' });

      expect(res.body).toEqual({
        success: false,
        msg: 'User not found'
      });
    });

    it('should handle unverified user', async () => {
      const mockUser = {
        id: 1,
        uname: 'testuser',
        email: 'test@example.com',
        otp: 123456,
        verified: false
      };
      users.findOne.mockResolvedValue(mockUser);

      const res = await request(testApp)
        .post('/login')
        .send({ user: 'testuser', pass: 'password' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: true,
        msg: 'pending',
        dd: mockUser
      });
      expect(sendOtp).toHaveBeenCalledWith('test@example.com', 123456);
    });

    it('should authenticate regular user successfully', async () => {
      const mockUser = {
        id: 2,
        uname: 'regularuser',
        fname: 'Regular User',
        pass: 'correct_password',
        verified: true
      };
      users.findOne.mockResolvedValue(mockUser);

      const res = await request(testApp)
        .post('/login')
        .send({ user: 'regularuser', pass: 'correct_password' });

      expect(res.body).toEqual({
        success: true,
        cok: `2-encrypted_regularuser-Regular User`
      });
    });

    it('should reject invalid credentials', async () => {
      const mockUser = {
        id: 2,
        uname: 'regularuser',
        pass: 'correct_password',
        verified: true
      };
      users.findOne.mockResolvedValue(mockUser);

      const res = await request(testApp)
        .post('/login')
        .send({ user: 'regularuser', pass: 'wrong_password' });

      expect(res.body).toEqual({
        success: false,
        msg: 'Invalid Credentials'
      });
    });

    it('should handle server errors', async () => {
      users.findOne.mockRejectedValue(new Error('DB error'));

      const res = await request(testApp)
        .post('/login')
        .send({ user: 'test', pass: 'test' });

      expect(res.body).toEqual({
        success: false,
        msg: 'An error occured !'
      });
    });
  });

  describe('POST /google-login', () => {
    const mockGoogleUser = {
      id: 3,
      uname: 'google123',
      fname: 'Google User',
      email: 'google@example.com'
    };

    beforeEach(() => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({
          sub: 'google123',
          email: 'google@example.com',
          name: 'Google User'
        })
      });
    });

    it('should authenticate with Google token successfully', async () => {
      users.findOne.mockResolvedValue(mockGoogleUser);

      const res = await request(testApp)
        .post('/google-login')
        .send({ token: 'valid-google-token' });

      expect(res.body).toEqual({
        success: true,
        cok: `3-encrypted_google123-Google User`
      });
    });

    it('should create new user for first-time Google login', async () => {
      users.findOne.mockResolvedValueOnce(null);
      users.create.mockResolvedValue(mockGoogleUser);

      const res = await request(testApp)
        .post('/google-login')
        .send({ token: 'valid-google-token' });

      expect(users.create).toHaveBeenCalledWith({
        uname: 'google123',
        email: 'google@example.com',
        fname: 'Google User',
        num: null,
        pass: null,
        otp: null,
        verified: true
      });
      expect(res.body.success).toBe(true);
    });

    it('should handle missing token', async () => {
      const res = await request(testApp)
        .post('/google-login')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        msg: 'Google login failed: Token is missing'
      });
    });

    it('should handle Google auth errors', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));

      const res = await request(testApp)
        .post('/google-login')
        .send({ token: 'invalid-token' });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toContain('Google login failed');
    });
  });
});