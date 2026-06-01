const prisma = require('../../../utils/prisma.js');
const AuditRepositories = require('../../audits/repositories/audit-repositories.js');

const ProfileRepositories = {
  async getProfile(user_id) {
    const user  = await prisma.user.findUnique({ where: { id: user_id } });
    const stats = await AuditRepositories.getUserAuditStats(user_id);
    return { ...user, stats };
  },
  updateProfile: (user_id, { name }) =>
    prisma.user.update({ where: { id: user_id }, data: { name },
      select: { id: true, name: true, email: true, avatar_url: true, updated_at: true } }),
};

module.exports = ProfileRepositories;