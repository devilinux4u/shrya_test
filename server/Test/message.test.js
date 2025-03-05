const request = require('supertest');
const express = require('express');
const contactRouter = require('../controllers/contactusControllers/message'); // Adjust path as needed
const { contacts } = require('../db/sequelize');

// Create test Express app
const testApp = express();
testApp.use(express.json());
testApp.use('/', contactRouter);

// Mock Sequelize model
jest.mock('../db/sequelize', () => ({
  contacts: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn()
  }
}));

describe('Contact Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /contact', () => {
    const mockContactData = {
      name: 'John Doe',
      email: 'john@example.com',
      phno: '1234567890',
      msg: 'Test message'
    };

    it('should create a new contact message', async () => {
      const mockCreatedContact = {
        id: 1,
        ...mockContactData,
        status: 'new'
      };
      contacts.create.mockResolvedValue(mockCreatedContact);

      const res = await request(testApp)
        .post('/contact')
        .send(mockContactData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        msg: "Message sent successfully"
      });
      expect(contacts.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phno: '1234567890',
        msg: 'Test message',
        status: 'new'
      });
    });

    it('should handle creation errors', async () => {
      contacts.create.mockRejectedValue(new Error('DB error'));

      const res = await request(testApp)
        .post('/contact')
        .send(mockContactData);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        success: false,
        msg: "Error while sending message"
      });
    });
  });

  describe('GET /contact', () => {
    it('should fetch all contact messages', async () => {
      const mockContacts = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phno: '1234567890',
          msg: 'Test message 1',
          date: '2023-01-01',
          status: 'new'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phno: '0987654321',
          msg: 'Test message 2',
          date: '2023-01-02',
          status: 'read'
        }
      ];

      contacts.findAll.mockResolvedValue(mockContacts);

      const res = await request(testApp).get('/contact');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockContacts);
      expect(contacts.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'name', 'email', 'phno', 'msg', 'date', 'status']
      });
    });

    it('should return empty array if no contacts', async () => {
      contacts.findAll.mockResolvedValue([]);

      const res = await request(testApp).get('/contact');

      expect(res.body).toEqual([]);
    });

    it('should handle fetch errors', async () => {
      contacts.findAll.mockRejectedValue(new Error('DB error'));

      const res = await request(testApp).get('/contact');

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        success: false,
        msg: "Error while fetching messages",
        error: 'DB error'
      });
    });
  });

  describe('PUT /contact/:id', () => {
    const mockUpdateData = {
      status: 'read'
    };

    it('should update contact status', async () => {
      const mockContact = {
        id: 1,
        status: 'new',
        save: jest.fn().mockResolvedValue(true)
      };
      contacts.findByPk.mockResolvedValue(mockContact);

      const res = await request(testApp)
        .put('/contact/1')
        .send(mockUpdateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        msg: "Message status updated successfully"
      });
      expect(mockContact.status).toBe('read');
      expect(mockContact.save).toHaveBeenCalled();
    });

    it('should return 404 if contact not found', async () => {
      contacts.findByPk.mockResolvedValue(null);

      const res = await request(testApp)
        .put('/contact/999')
        .send(mockUpdateData);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        success: false,
        msg: "Message not found"
      });
    });

    it('should handle update errors', async () => {
      const mockContact = {
        id: 1,
        status: 'new',
        save: jest.fn().mockRejectedValue(new Error('DB error'))
      };
      contacts.findByPk.mockResolvedValue(mockContact);

      const res = await request(testApp)
        .put('/contact/1')
        .send(mockUpdateData);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        success: false,
        msg: "Error while updating status"
      });
    });
  });

  describe('DELETE /contact/:id', () => {
    it('should delete a contact message', async () => {
      const mockContact = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };
      contacts.findByPk.mockResolvedValue(mockContact);

      const res = await request(testApp).delete('/contact/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        msg: "Message deleted successfully"
      });
      expect(mockContact.destroy).toHaveBeenCalled();
    });

    it('should return 404 if contact not found', async () => {
      contacts.findByPk.mockResolvedValue(null);

      const res = await request(testApp).delete('/contact/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        success: false,
        msg: "Message not found"
      });
    });

    it('should handle deletion errors', async () => {
      const mockContact = {
        id: 1,
        destroy: jest.fn().mockRejectedValue(new Error('DB error'))
      };
      contacts.findByPk.mockResolvedValue(mockContact);

      const res = await request(testApp).delete('/contact/1');

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        success: false,
        msg: "Error while deleting message"
      });
    });
  });
});