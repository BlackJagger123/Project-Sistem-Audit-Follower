const Joi = require('joi');
const { InvariantError } = require('../../../exceptions/index.js');

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token wajib diisi',
    'any.required': 'Refresh token wajib diisi',
  }),
});

const validateRefreshToken = (req, _res, next) => {
  const { error, value } = refreshTokenSchema.validate(req.body);
  if (error) return next(new InvariantError(error.details[0].message));
  req.validated = value;
  return next();
};

module.exports = { validateRefreshToken };