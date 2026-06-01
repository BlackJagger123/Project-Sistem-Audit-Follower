const AuditRepositories = require('../repositories/audit-repositories.js');
const { analyzeInstagramAccount } = require('../../../utils/ai-service.js');
const { NotFoundError, AuthorizationError } = require('../../../exceptions/index.js');
const response = require('../../../utils/response.js');

const createAudit = async (req, res, next) => {
  try {
    const { ig_username } = req.validated;
    const user_id = req.user.id;
    const audit = await AuditRepositories.createAudit({ user_id, ig_username });
    let aiResult;
    try {
      aiResult = await analyzeInstagramAccount(ig_username);
    } catch (err) {
      await AuditRepositories.updateAuditFailed(audit.id, err.message);
      return next(err);
    }
    const completed = await AuditRepositories.updateAuditCompleted(audit.id, aiResult);
    return response(res, 201, 'Audit berhasil diselesaikan', completed);
  } catch (err) {
    return next(err);
  }
};

const getAllAudits = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const page    = parseInt(req.query.page)  || 1;
    const limit   = parseInt(req.query.limit) || 10;
    const result  = await AuditRepositories.getAllAuditsByUser(user_id, page, limit);
    return response(res, 200, 'Riwayat audit berhasil diambil', result);
  } catch (err) {
    return next(err);
  }
};

const getAuditById = async (req, res, next) => {
  try {
    const { id }  = req.params;
    const user_id = req.user.id;
    const audit   = await AuditRepositories.getAuditById(id, user_id);
    if (!audit) return next(new NotFoundError('Audit tidak ditemukan'));
    if (audit.user_id !== user_id) return next(new AuthorizationError('Anda tidak berhak mengakses audit ini'));
    return response(res, 200, 'Detail audit berhasil diambil', audit);
  } catch (err) {
    return next(err);
  }
};

module.exports = { createAudit, getAllAudits, getAuditById };