const prisma = require('../../../utils/prisma.js');

const UserRepositories = {
  findByProviderId: (provider_id) => prisma.user.findUnique({ where: { provider_id } }),
  findById:         (id)          => prisma.user.findUnique({ where: { id } }),
  createUser: ({ email, name, avatar_url, provider, provider_id }) =>
    prisma.user.create({ data: { email, name, avatar_url, provider, provider_id } }),
  updateUser: (id, { avatar_url }) =>
    prisma.user.update({ where: { id }, data: { avatar_url } }),
};

module.exports = UserRepositories;