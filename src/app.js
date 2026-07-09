require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { initializeDatabase, User } = require('./models');
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const proposalRoutes = require('./routes/proposals');
const dashboardRoutes = require('./routes/dashboard');
const providerRoutes = require('./routes/providers');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const serviceRoutes = require('./routes/services');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'maqsad-jwt-secret-2024';
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

app.use(cors({
  origin: IS_PRODUCTION
    ? (process.env.FRONTEND_URL || true)
    : 'http://localhost:5174',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── JWT Auth Middleware ───────────────────────────────────────────────
// Reads the JWT from an httpOnly cookie and populates req.user
app.use(async (req, res, next) => {
  const token = req.cookies?.maqsad_token;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = await User.findByPk(payload.userId);
  } catch {
    // Invalid/expired token — clear it
    res.clearCookie('maqsad_token');
  }
  next();
});

// Expose helpers so auth routes can set/clear the cookie
app.locals.signAndSetToken = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('maqsad_token', token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};

app.locals.clearToken = (res) => {
  res.clearCookie('maqsad_token', {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? 'none' : 'lax',
  });
};

app.use('/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/services', serviceRoutes);

// Serve static files from the React frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Wildcard route to serve React's index.html, excluding API/auth routes
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/auth')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

initializeDatabase().then(async () => {
  // Seed default admin user if it does not exist
  try {
    const adminEmail = 'admin@maqsad.com';
    const adminPassword = 'adminpassword123';
    const bcrypt = require('bcrypt');
    const existing = await User.findOne({ where: { email: adminEmail } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: adminEmail,
        passwordHash,
        fullName: 'Maqsad Administrator',
        role: 'admin',
        accountStatus: 'active',
        emailVerifiedAt: new Date(),
      });
      console.log(`Default admin seeded: ${adminEmail} / ${adminPassword}`);
    }
  } catch (seedErr) {
    console.error('Failed to seed default admin:', seedErr.message);
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Maqsad backend listening on http://localhost:${PORT}`);
    });
  }
}).catch((error) => {
  console.error('Initialization failed', error);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

module.exports = app;
