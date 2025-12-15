module.exports = {
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/", "/scripts/"],
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  verbose: true,
  testTimeout: 60000, // 60 seconds per test
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
