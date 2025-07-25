
import { Request, Response } from 'express';
import { PgUserRepository } from '../../infrastructure/repositories/PgUserRepository';
import { pool } from '../../infrastructure/database/pgPool';
import { UserService } from '../services/UserService';

const userRepository = new PgUserRepository(pool);
const userService = new UserService(userRepository);

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        console.warn('Register failed: Missing fields');
        return res.status(400).json({ message: 'Missing fields' });
      }
      
      try {
        const newUser = await userService.registerUser(username, email, password);
        console.info(`User registered successfully: ${newUser.username} (${newUser.email})`);
        res.status(201).json({ message: 'User registered' });
      } catch (err: any) {
        if (err.message === 'User already exists') {
          console.warn(`Register failed: User already exists (${email})`);
          return res.status(409).json({ message: 'User already exists' });
        }
        throw err;
      }
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        console.warn('Login failed: Missing fields');
        return res.status(400).json({ message: 'Missing fields' });
      }

      try {
        const loginResult = await userService.loginUser(email, password);
        console.info(`User logged in successfully: ${email}`);
        res.status(200).json(loginResult);
      } catch (err: any) {
        if (err.message === 'Invalid credentials') {
          console.warn(`Login failed: Invalid credentials for ${email}`);
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        throw err;
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
