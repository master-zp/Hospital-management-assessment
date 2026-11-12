const jwt = require('jsonwebtoken');

function getSecret() {
  return process.env.JWT_SECRET || 'hms-assessment-dev-secret-change-me';
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role, fullName: user.fullName },
    getSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const payload = jwt.verify(token, getSecret());
    req.user = {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      fullName: payload.fullName,
    };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { signToken, requireAuth };
