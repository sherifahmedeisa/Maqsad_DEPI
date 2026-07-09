const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, EmailVerification, PasswordReset } = require('../models');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 10;
const TOKEN_DURATION_MS = 1000 * 60 * 60 * 24;

const safeUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...rest } = user.toJSON();
  return rest;
};

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, fullName, role = 'beneficiary' } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!['beneficiary', 'provider'].includes(role)) {
      return res.status(400).json({ error: 'Role must be beneficiary or provider' });
    }

    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      fullName,
      role,
      accountStatus: 'active',
      emailVerifiedAt: new Date(),
    });

    req.session.userId = user.id;
    res.status(201).json({ user: safeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const allowed = await bcrypt.compare(password, user.passwordHash);
    if (!allowed) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.accountStatus !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    req.session.userId = user.id;
    res.json({ user: safeUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', ensureAuthenticated, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/status', (req, res) => {
  if (!req.user) {
    return res.json({ authenticated: false });
  }
  res.json({ authenticated: true, user: safeUser(req.user) });
});

router.post('/request-password-reset', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_DURATION_MS);
    await PasswordReset.create({ userId: user.id, token, expiresAt });

    res.json({ message: 'Password reset token created', token });
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    const reset = await PasswordReset.findOne({ where: { token } });
    if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = await User.findByPk(reset.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    user.accountStatus = 'active';
    await user.save();

    reset.usedAt = new Date();
    await reset.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/verify-email', async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const verification = await EmailVerification.findOne({ where: { token } });
    if (!verification || verification.usedAt || verification.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    const user = await User.findByPk(verification.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.emailVerifiedAt = new Date();
    user.accountStatus = 'active';
    await user.save();

    verification.usedAt = new Date();
    await verification.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
