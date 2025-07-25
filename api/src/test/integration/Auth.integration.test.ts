import request from 'supertest';
import app from '../../app';
import { v4 as uuidv4 } from 'uuid';

describe('Authentication Integration', () => {

  const createTestUser = () => {
    const uniqueId = uuidv4();
    return {
      username: `test_user_${uniqueId}`,
      email: `test_user_${uniqueId}@test.com`,
      password: 'TestPassword123!'
    };
  };

  describe('User Registration', () => {
    it('should allow user registration with valid data', async () => {
      const testUser = createTestUser();

      const response = await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User registered');
    });

    it('should reject registration with duplicate username', async () => {
      const testUser = createTestUser();

      // First registration should succeed
      await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Second registration with same username should fail
      await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(409); // Changed from 400 to 409 (Conflict)
    });

    it('should reject registration with invalid data', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          username: '', // Invalid: empty username
          email: '', // Invalid: empty email
          password: 'test123'
        })
        .expect(400);
    });
  });

  describe('User Login', () => {
    it('should allow login with valid credentials', async () => {
      const testUser = createTestUser();

      // First register the user
      await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Then login
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token'); // Changed from 'token' to 'access_token'
      expect(response.body).toHaveProperty('token_type');
      expect(response.body.token_type).toBe('Bearer');
    });

    it('should reject login with invalid credentials', async () => {
      const testUser = createTestUser();

      await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email, // User doesn't exist
          password: testUser.password
        })
        .expect(401);
    });

    it('should reject login with wrong password', async () => {
      const testUser = createTestUser();

      // Register user
      await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Try login with wrong password
      await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!'
        })
        .expect(401);
    });
  });
});
