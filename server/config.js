module.exports = {

    // MongoDB Connection String
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/TokenManager',

    // SERVER PORT
    SERVER_PORT : process.env.SERVER_PORT || 3200,
  
    // JWT Token Secret
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'pvpnCCZfwOF85pBjbOebZiYIDhZ3w9LZrKwBZ7152K89mPCOHtbRlmr5Z91ci4L',
  
    // Express Server Port
    LISTEN_PORT: process.env.LISTEN_PORT || 3200,

    // Password Salt
    PASSWORD_SALT : process.env.PASSWORD_SALT || 10,

    // JWT Token expiry & encryption algorithm
    JWT_TOKEN_EXPIRY: process.env.JWT_TOKEN_EXPIRY || '3600000',
    JWT_TOKEN_ALGORITHM: process.env.JWT_TOKEN_ALGORITHM || 'RS256',
    JWT_TOKEN_SUBJECT: process.env.JWT_TOKEN_SUBJECT || 'JWT Token',

    // Input validations
    EMAIL_MIN_LENGHT : process.env.EMAIL_MIN_LENGHT || 8,
    EMAIL_MAX_LENGHT : process.env.EMAIL_MAX_LENGHT || 127,
    DEFAULT_MIN_LENGHT: process.env.DEFAULT_MIN_LENGHT || 6,
    DEFAULT_MAX_LENGHT: process.env.DEFAULT_MAX_LENGHT || 255,
    TOKENID_MIN_LENGHT: process.env.TOKENID_MIN_LENGHT || 6,
    TOKENID_MAX_LENGHT: process.env.TOKENID_MAX_LENGHT || 12,
    API_TOKEN_EXPIRES_IN: process.env.API_TOKEN_EXPIRES_IN || 604800000,

    // Unit test data
    UNITTEST_USER_EMAIL : process.env.UNITTEST_USER_EMAIL || "adminUnitTest@test.com",
    UNITTEST_USER_NAME : process.env.UNITTEST_USER_NAME || "adminUnitTest",
    UNITTEST_USER_PASSWORD : process.env.UNITTEST_USER_PASSWORD || "test1234",
    UNITTEST_TOKEN_NAME : process.env.UNITTEST_TOKEN_NAME || "Unit testing Token ",
    UNITTEST_TOKEN_DESCRIPTION: process.env.UNITTEST_TOKEN_DESCRIPTION || "Unit testing Token created at ",
    UNITTEST_JWTTOKEN : process.env.UNITTEST_JWTTOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGZiYTIzMTA2OWNhMjdjNDU4ZWViZDUiLCJpYXQiOjE2MjcxMDM3OTN9.1_YpHNWFVG1-tuKlt6djsriqoS-TTByCkkVAZHLFWiw"
  }