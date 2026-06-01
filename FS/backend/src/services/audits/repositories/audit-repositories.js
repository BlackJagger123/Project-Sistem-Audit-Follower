const prisma = require('../../../utils/prisma.js');

const AuditRepositories = {
  createAudit: ({ user_id, ig_username }) =>
    prisma.audit.create({ data: { user_id, ig_username, status: 'pending' } }),

  updateAuditCompleted: (id, { total_sample, bot_percentage, real_percentage, risk_label, recommendation, raw_ai_response }) =>
    prisma.audit.update({ where: { id }, data: { status: 'completed', total_sample, bot_percentage, real_percentage, risk_label, recommendation, raw_ai_response } }),

  updateAuditFailed: (id, error_message) =>
    prisma.audit.update({ where: { id }, data: { status: 'failed', error_message } }),

  async getAllAuditsByUser(user_id, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await prisma.$transaction([
      prisma.audit.findMany({ where: { user_id }, orderBy: { created_at: 'desc' }, skip, take: limit,
        select: { id: true, ig_username: true, status: true, bot_percentage: true, risk_label: true, recommendation: true, created_at: true } }),
      prisma.audit.count({ where: { user_id } }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  getAuditById: (id, user_id) => prisma.audit.findFirst({ where: { id, user_id } }),

  async getUserAuditStats(user_id) {
    const result = await prisma.audit.aggregate({
      where: { user_id, status: 'completed' },
      _count: { id: true }, _avg: { bot_percentage: true },
    });
    return {
      total_audits:       result._count.id,
      avg_bot_percentage: result._avg.bot_percentage ? parseFloat(result._avg.bot_percentage.toFixed(2)) : 0,
    };
  },
};

module.exports = AuditRepositories;