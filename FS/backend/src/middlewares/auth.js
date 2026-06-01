const TokenManager     = require('../security/token-manager.js');
const UserRepositories = require('../services/users/repositories/user-repositories.js');
const { AuthenticationError } = require('../exceptions/index.js');

const authMiddleware = async (req, _res, next) => {
  try {
    // if (process.env.NODE_ENV === 'development') {
    //   req.user = { id: '62f5ac10-9442-4ab5-baec-9c4a84a9c7ce' };
    //   return next();
    // }
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next(new AuthenticationError('Token tidak ditemukan'));
    const token = authHeader.split(' ')[1];
    const { id } = TokenManager.verifyAccessToken(token);
    const user = await UserRepositories.findById(id);
    if (!user) return next(new AuthenticationError('User tidak ditemukan'));
    req.user = user;
    return next();
  } catch (err) { return next(err); }
};

module.exports = authMiddleware;