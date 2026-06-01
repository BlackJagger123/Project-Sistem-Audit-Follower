const ProfileRepositories = require('../repositories/profile-repositories.js');
const response = require('../../../utils/response.js');

const getProfile = async (req, res, next) => {
  try {
    const profile = await ProfileRepositories.getProfile(req.user.id);
    return response(res, 200, 'Profil berhasil diambil', profile);
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updated = await ProfileRepositories.updateProfile(req.user.id, req.validated);
    return response(res, 200, 'Profil berhasil diperbarui', updated);
  } catch (err) {
    return next(err);
  }
};

module.exports = { getProfile, updateProfile };