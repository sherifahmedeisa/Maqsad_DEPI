exports.ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

exports.ensureRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { role } = req.user;
  if (allowedRoles.includes(role)) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
};

exports.ensureOwnerOrAdmin = (getOwnerId) => async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { role, id } = req.user;
  const ownerId = await getOwnerId(req);
  if (role === 'admin' || ownerId === id) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
};
