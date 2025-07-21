
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PgUserRepository } from '../../infrastructure/repositories/PgUserRepository';
import { pool } from '../../infrastructure/database/pgPool';
import { UserService } from '../services/UserService';

const userRepository = new PgUserRepository(pool);
const userService = new UserService(userRepository);
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

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
      const user = await userRepository.findByEmail(email);
      if (!user) {
        console.warn(`Login failed: User not found (${email})`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        console.warn(`Login failed: Invalid password for user (${email})`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      console.info(`User logged in successfully: ${user.username} (${user.email})`);
      res.status(200).json({ access_token: token, token_type: 'Bearer', expires_in: 3600 });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
