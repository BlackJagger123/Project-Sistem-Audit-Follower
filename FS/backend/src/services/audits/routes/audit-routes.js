const { Router }   = require('express');
const authMiddleware = require('../../../middlewares/auth.js');
const { validateCreateAudit } = require('../validator/audit-validator.js');
const { createAudit, getAllAudits, getAuditById } = require('../controller/audit-controller.js');

const router = Router();

router.use(authMiddleware);

router.post('/',    validateCreateAudit, createAudit);
router.get('/',     getAllAudits);
router.get('/:id',  getAuditById);

module.exports = router;