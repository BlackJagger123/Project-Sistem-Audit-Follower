const response = (res, statusCode, message, data = null) => {
  const payload = { status: statusCode < 400 ? 'success' : 'fail', message };
  if (data) payload.data = data;
  return res.status(statusCode).json(payload);
};

module.exports = response;