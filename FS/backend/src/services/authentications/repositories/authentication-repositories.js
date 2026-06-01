const prisma = require('../../../utils/prisma.js');
const { InvariantError } = require('../../../exceptions/index.js');

const AuthenticationRepositories = {
  async addRefreshToken(token, user_id) {
    return prisma.authentication.create({
      data: { token, user_id },
    });
  },

  async verifyRefreshToken(token) {
    const auth = await prisma.authentication.findUnique({
      where: { token },
    });

    if (!auth) throw new InvariantError('Refresh token tidak valid');

    return auth;
  },

  async deleteRefreshToken(token) {
    return prisma.authentication.delete({
      where: { token },
    });
  },

  async deleteAllUserTokens(user_id) {
    return prisma.authentication.deleteMany({
      where: { user_id },
    });
  },
};

module.exports = AuthenticationRepositories;