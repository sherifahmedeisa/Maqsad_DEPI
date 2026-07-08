const express = require('express');
const { User, BeneficiaryProfile, ProviderProfile } = require('../models');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', ensureAuthenticated, ensureRole(['admin']), async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'fullName', 'phone', 'country', 'city', 'role', 'accountStatus', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/me', ensureAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'fullName', 'phone', 'country', 'city', 'profilePictureUrl', 'role', 'accountStatus', 'subscriptionTier', 'emailVerifiedAt', 'createdAt', 'updatedAt'],
      include: [
        { model: BeneficiaryProfile, as: 'beneficiaryProfile' },
        { model: ProviderProfile, as: 'providerProfile' },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/me', ensureAuthenticated, async (req, res, next) => {
  try {
    const { fullName, phone, country, city, profilePictureUrl, subscriptionTier } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.fullName = fullName ?? user.fullName;
    user.phone = phone ?? user.phone;
    user.country = country ?? user.country;
    user.city = city ?? user.city;
    user.profilePictureUrl = profilePictureUrl ?? user.profilePictureUrl;
    user.subscriptionTier = subscriptionTier ?? user.subscriptionTier;
    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/role', ensureAuthenticated, ensureRole(['admin']), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { role } = req.body;
    if (!['beneficiary', 'provider', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    user.role = role;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', ensureAuthenticated, ensureRole(['admin']), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { status } = req.body;
    if (!['pending', 'active', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    user.accountStatus = status;
    await user.save();
    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      accountStatus: user.accountStatus,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
