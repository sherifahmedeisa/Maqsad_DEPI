require('dotenv').config();
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
    cookie: { 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    },
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

app.get('/', (req, res) => {
  res.json({ message: 'Maqsad backend is running.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Maqsad backend listening on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Initialization failed', error);
  process.exit(1);
});
