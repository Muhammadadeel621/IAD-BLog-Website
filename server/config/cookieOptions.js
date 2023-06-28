const options = { httpOnly: true, secure: true, sameSite: 'None' };
const maxAge = 24 * 60 * 60 * 1000; // 24 hours

module.exports = { options, maxAge };
