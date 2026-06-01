const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../exceptions/index.js');

const TokenManager = {
  generateAccessToken:  (payload) => jwt.sign(payload, process.env.JWT_ACCESS_SECRET,  { expiresIn: '15m' }),
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
  verifyAccessToken(token) {
    try { return jwt.verify(token, process.env.JWT_ACCESS_SECRET); }
    catch { throw new AuthenticationError('Access token tidak valid'); }
  },
  verifyRefreshToken(token) {
    try { return jwt.verify(token, process.env.JWT_REFRESH_SECRET); }
    catch { throw new AuthenticationError('Refresh token tidak valid'); }
  },
};

module.exports = TokenManager;