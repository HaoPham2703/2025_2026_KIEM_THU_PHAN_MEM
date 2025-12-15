/**
 * Helper functions cho testing
 */

/**
 * Tạo mock request object
 */
const createMockRequest = (overrides = {}) => {
  return {
    body: {},
    cookies: {},
    headers: {},
    params: {},
    query: {},
    user: null,
    get: jest.fn((header) => {
      if (header === 'host') return 'localhost:3000';
      return '';
    }),
    protocol: 'http',
    ...overrides,
  };
};

/**
 * Tạo mock response object
 */
const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    locals: {},
  };
  return res;
};

/**
 * Tạo mock next function
 */
const createMockNext = () => {
  return jest.fn();
};

/**
 * Tạo user test data
 */
const createTestUser = (overrides = {}) => {
  return {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    active: 'active',
    role: 'user',
    ...overrides,
  };
};

module.exports = {
  createMockRequest,
  createMockResponse,
  createMockNext,
  createTestUser,
};

