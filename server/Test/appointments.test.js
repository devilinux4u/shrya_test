const request = require('supertest');
const express = require('express');
const appointmentsRouter = require('../controllers/appointmentControllers/appointments'); // Adjust path as needed

// Create a test Express app
const testApp = express();
testApp.use(express.json());
testApp.use('/appointments', appointmentsRouter);

// Mock Sequelize models
jest.mock('../db/sequelize', () => ({
  Appointment: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    save: jest.fn(),
  },
  users: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
  vehicles: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
  v_img: {}
}));

const { Appointment, users, vehicles } = require('../db/sequelize');

describe('Appointment Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /appointments', () => {
    it('should create an appointment successfully', async () => {
      // Mock data
      const mockUser = { id: 1 };
      const mockVehicle = { id: 1, uid: 2 };
      const mockAppointment = {
        id: 1,
        userId: 1,
        SelleruserId: 2,
        vehicleId: 1,
        date: '2025-05-01',
        time: '10:00',
        location: 'Kathmandu',
        description: 'Test appointment',
        status: 'pending'
      };

      // Mock implementations
      users.findByPk.mockResolvedValue(mockUser);
      vehicles.findByPk.mockResolvedValue(mockVehicle);
      vehicles.findOne.mockResolvedValue(mockVehicle);
      Appointment.create.mockResolvedValue(mockAppointment);

      const res = await request(testApp)
        .post('/appointments')
        .send({
          userId: 1,
          vehicleId: 1,
          date: '2025-05-01',
          time: '10:00',
          location: 'Kathmandu',
          description: 'Test appointment'
        });

      // Assertions
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        success: true,
        message: 'Appointment created',
        data: mockAppointment
      });
      expect(users.findByPk).toHaveBeenCalledWith(1);
      expect(vehicles.findByPk).toHaveBeenCalledWith(1);
      expect(Appointment.create).toHaveBeenCalledWith({
        userId: 1,
        SelleruserId: 2,
        vehicleId: 1,
        date: '2025-05-01',
        time: '10:00',
        location: 'Kathmandu',
        description: 'Test appointment',
        status: 'pending'
      });
    });

    it('should return 404 if user not found', async () => {
      users.findByPk.mockResolvedValue(null);

      const res = await request(testApp)
        .post('/appointments')
        .send({
          userId: 999,
          vehicleId: 1,
          date: '2025-05-01',
          time: '10:00',
          location: 'Kathmandu',
          description: 'Test appointment'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: 'User not found'
      });
    });

    it('should return 404 if vehicle not found', async () => {
      users.findByPk.mockResolvedValue({ id: 1 });
      vehicles.findByPk.mockResolvedValue(null);

      const res = await request(testApp)
        .post('/appointments')
        .send({
          userId: 1,
          vehicleId: 999,
          date: '2025-05-01',
          time: '10:00',
          location: 'Kathmandu',
          description: 'Test appointment'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: 'Vehicle not found'
      });
    });

    it('should return 500 if database error occurs', async () => {
      users.findByPk.mockResolvedValue({ id: 1 });
      vehicles.findByPk.mockResolvedValue({ id: 1, uid: 2 });
      Appointment.create.mockRejectedValue(new Error('Database error'));

      const res = await request(testApp)
        .post('/appointments')
        .send({
          userId: 1,
          vehicleId: 1,
          date: '2025-05-01',
          time: '10:00',
          location: 'Kathmandu',
          description: 'Test appointment'
        });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('GET /appointments', () => {
    it('should fetch all appointments successfully', async () => {
      const mockAppointments = [{
        id: 1,
        userId: 1,
        SelleruserId: 2,
        vehicleId: 1,
        date: '2025-05-01',
        time: '10:00',
        status: 'pending',
        SellVehicle: {
          id: 1,
          v_img: [{ id: 1, image: 'test.jpg' }],
          Seller: { id: 2, fname: 'Seller' }
        },
        Buyer: { id: 1, fname: 'Buyer' }
      }];

      Appointment.findAll.mockResolvedValue(mockAppointments);

      const res = await request(testApp).get('/appointments');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: 'Appointments fetched successfully',
        data: mockAppointments
      });
    });

    it('should return 500 if database error occurs', async () => {
      Appointment.findAll.mockRejectedValue(new Error('Database error'));

      const res = await request(testApp).get('/appointments');

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('GET /appointments/user/:userId', () => {
    it('should fetch user appointments successfully', async () => {
      const mockAppointments = {
        asBuyer: [{ id: 1, userId: 1 }],
        asSeller: [{ id: 2, SelleruserId: 1 }]
      };

      Appointment.findAll
        .mockResolvedValueOnce(mockAppointments.asBuyer)
        .mockResolvedValueOnce(mockAppointments.asSeller);

      const res = await request(testApp).get('/appointments/user/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: 'Appointments fetched successfully',
        data: mockAppointments
      });
    });
  });

  describe('PATCH /appointments/:id/status', () => {
    

    it('should return 404 if appointment not found', async () => {
      Appointment.findByPk.mockResolvedValue(null);

      const res = await request(testApp)
        .patch('/appointments/999/status')
        .send({ status: 'confirmed' });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});