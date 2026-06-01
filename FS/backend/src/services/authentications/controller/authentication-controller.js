const TokenManager = require('../../../security/token-manager.js');
const AuthenticationRepositories = require('../repositories/authentication-repositories.js');
const { InvariantError } = require('../../../exceptions/index.js');
const response = require('../../../utils/response.js');

const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;
    const accessToken  = TokenManager.generateAccessToken({ id: user.id });
    const refreshToken = TokenManager.generateRefreshToken({ id: user.id });
    await AuthenticationRepositories.addRefreshToken(refreshToken, user.id);

    const getFrontendUrl = () => {
      return process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL_PROD
        : process.env.FRONTEND_URL;
    };
    
    return res.redirect(
      `${getFrontendUrl()}/auth/callback?token=${accessToken}&refresh=${refreshToken}`
    );
  } catch (err) {
    return next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.validated;
    await AuthenticationRepositories.verifyRefreshToken(token);
    const { id } = TokenManager.verifyRefreshToken(token);
    const accessToken = TokenManager.generateAccessToken({ id });
    return response(res, 200, 'Access token berhasil diperbarui', { accessToken });
  } catch (err) {
    return next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.validated;
    await AuthenticationRepositories.verifyRefreshToken(token);
    await AuthenticationRepositories.deleteRefreshToken(token);
    return response(res, 200, 'Logout berhasil');
  } catch (err) {
    return next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    return response(res, 200, 'Data user berhasil diambil', {
      id:         req.user.id,
      name:       req.user.name,
      email:      req.user.email,
      avatar_url: req.user.avatar_url,
      created_at: req.user.created_at,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { googleCallback, refreshToken, logout, getMe };