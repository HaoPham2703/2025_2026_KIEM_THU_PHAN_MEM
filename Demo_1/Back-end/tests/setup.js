const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: "6.0.14",
    },
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}, 120000); // 2 minutes timeout for initial MongoDB download

// Cleanup after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Set environment variables for testing
process.env.JWT_SECRET = "test-jwt-secret-key-for-testing-only";
process.env.JWT_EXPIRES_IN = "90d";
process.env.JWT_COOKIE_EXPIRES_IN = 90;
process.env.NODE_ENV = "test";
process.env.EMAIL_HOST = "smtp.gmail.com";
process.env.EMAIL_PORT = 587;
process.env.EMAIL_USERNAME = "test@example.com";
process.env.EMAIL_PASSWORD = "testpassword";
process.env.EMAIL_FROM = "test@example.com";
