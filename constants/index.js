const JWT_SECURE =
  process.env.NODE_ENV === 'development'
    ? false
    : process.env.NODE_ENV === 'production'
    ? true
    : false;

module.exports = { JWT_SECURE };
