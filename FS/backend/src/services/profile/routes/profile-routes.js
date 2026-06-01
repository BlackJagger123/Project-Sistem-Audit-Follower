const { Router }   = require('express');
const authMiddleware = require('../../../middlewares/auth.js');
const { validateUpdateProfile } = require('../validator/profile-validator.js');
const { getProfile, updateProfile } = require('../controller/profile-controller.js');

const router = Router();

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', validateUpdateProfile, updateProfile);

module.exports = router;