import { Pool } from 'pg';
import { User } from '../../domain/models/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class PgUserRepository implements UserRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        console.info(`[PgUserRepository] No user found with email: ${email}`);
        return null;
      }
      const row = result.rows[0];
      console.info(`[PgUserRepository] User found with email: ${email}`);
      return User.fromPrimitives(row.id, row.username, row.email, row.password, row.createdat);
    } catch (error) {
      console.error(`[PgUserRepository] Error finding user by email (${email}):`, error);
      throw error;
    }
  }

  async save(user: User): Promise<void> {
    try {
      const petition = await this.pool.query(
        'INSERT INTO users (id, username, email, password, createdat) VALUES ($1, $2, $3, $4, $5)',
        [user.id, user.username, user.email, user.password, user.createdAt]
      );
      if (petition.rowCount === 0) {
        console.error(`[PgUserRepository] User not saved: ${user.email}`);
        throw new Error('User not saved');
      }
      console.info(`[PgUserRepository] User saved successfully: ${user.email}`);
    } catch (error) {
      console.error(`[PgUserRepository] Error saving user (${user.email}):`, error);
      throw error;
    }
  }
}
