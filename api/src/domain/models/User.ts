import { v4 as uuidv4 } from 'uuid';

export class User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;

  private constructor(id: string, username: string, email: string, password: string, createdAt: Date) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
  }

  static create(username: string, email: string, password: string): User {
    return new User(uuidv4(), username, email, password, new Date());
  }

  static fromPrimitives(id: string, username: string, email: string, password: string, createdAt: Date): User {
    return new User(id, username, email, password, createdAt);
  }
}
