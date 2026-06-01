const { Router } = require('express');
const authenticationRoutes = require('../services/authentications/routes/authentication-routes.js');
const auditRoutes          = require('../services/audits/routes/audit-routes.js');
const profileRoutes        = require('../services/profile/routes/profile-routes.js');

const router = Router();

router.use('/auth',    authenticationRoutes);
router.use('/audits',  auditRoutes);
router.use('/profile', profileRoutes);

module.exports = router;