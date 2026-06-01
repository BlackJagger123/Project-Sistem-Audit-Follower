const Joi = require('joi');
const { InvariantError } = require('../../../exceptions/index.js');

const createAuditSchema = Joi.object({
  ig_username: Joi.string().min(1).max(30).pattern(/^[^@]/).required().messages({
    'string.empty':        'Username Instagram wajib diisi',
    'string.min':          'Username minimal 1 karakter',
    'string.max':          'Username maksimal 30 karakter',
    'string.pattern.base': 'Username tidak boleh mengandung @',
    'any.required':        'Username Instagram wajib diisi',
  }),
});

const validateCreateAudit = (req, _res, next) => {
  const { error, value } = createAuditSchema.validate(req.body);
  if (error) return next(new InvariantError(error.details[0].message));
  req.validated = value;
  return next();
};

module.exports = { validateCreateAudit };