const response = require('../utils/response.js');

const errorMiddleware = (err, _req, res, _next) => {
  const statusCode = err.statusCode ?? 500;

  let message;
  switch (statusCode) {
    case 403: message = err.message; break;
    case 500: message = 'Gagal memproses akun, silakan coba lagi'; break;
    default:  message = err.message; break;
  }

  if (statusCode === 500) console.error(err);

  return response(res, statusCode, message);
};

module.exports = errorMiddleware;