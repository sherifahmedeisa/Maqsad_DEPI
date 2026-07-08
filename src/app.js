require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { initializeDatabase, User } = require('./models');
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const proposalRoutes = require('./routes/proposals');
const dashboardRoutes = require('./routes/dashboard');
const providerRoutes = require('./routes/providers');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  }),
);

app.use(async (req, res, next) => {
  if (req.session?.userId) {
    try {
      req.user = await User.findByPk(req.session.userId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

app.use('/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

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

  app.listen(PORT, () => {
    console.log(`Maqsad backend listening on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Initialization failed', error);
  process.exit(1);
});
