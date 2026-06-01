const { Router }   = require('express');
const passport     = require('../../../security/passport.js');
const authMiddleware = require('../../../middlewares/auth.js');
const { googleCallback, refreshToken, logout, getMe } = require('../controller/authentication-controller.js');
const { validateRefreshToken } = require('../validator/authentication-validator.js');

const router = Router();

router.get('/google',          passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleCallback);
router.get('/me',              authMiddleware, getMe);
router.put('/refresh',         validateRefreshToken, refreshToken);
router.delete('/logout',       validateRefreshToken, logout);

module.exports = router;