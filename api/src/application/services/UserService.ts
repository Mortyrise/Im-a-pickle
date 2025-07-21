import { User } from '../../domain/models/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import bcrypt from 'bcryptjs';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(username: string, email: string, password: string): Promise<User> {
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = User.create(username, email, hashedPassword);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
