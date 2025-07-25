// Global test setup
console.log('🧪 Setting up tests...');

// Mock Redis by default
jest.mock('../infrastructure/redis/RedisClient', () => ({
  getRedisKey: jest.fn(),
  setRedisKey: jest.fn(),
}));

// Mock external API calls by default
jest.mock('../infrastructure/utils/apiCaller', () => ({
  externalApiCaller: {
    call: jest.fn(),
  },
}));
