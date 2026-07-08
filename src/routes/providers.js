const express = require('express');
const { Op } = require('sequelize');
const { ProviderProfile, User } = require('../models');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const where = {};
    if (req.query.tag) {
      where.serviceTags = { [Op.like]: `%"${req.query.tag}"%` };
    }
    const providers = await ProviderProfile.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'fullName'] }],
      order: [['companyName', 'ASC']],
    });
    res.json(providers);
  } catch (error) {
    next(error);
  }
});

router.get('/me', ensureAuthenticated, ensureRole(['provider']), async (req, res, next) => {
  try {
    const providerProfile = await ProviderProfile.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'fullName'] }],
    });
    res.json(providerProfile || null);
  } catch (error) {
    next(error);
  }
});

router.put('/me', ensureAuthenticated, ensureRole(['provider']), async (req, res, next) => {
  try {
    const { companyName, description, serviceTags, websiteUrl } = req.body;
    let providerProfile = await ProviderProfile.findOne({ where: { userId: req.user.id } });
    if (!providerProfile) {
      providerProfile = await ProviderProfile.create({
        userId: req.user.id,
        companyName,
        description,
        serviceTags,
        websiteUrl,
      });
    } else {
      await providerProfile.update({
        companyName: companyName ?? providerProfile.companyName,
        description: description ?? providerProfile.description,
        serviceTags: serviceTags ?? providerProfile.serviceTags,
        websiteUrl: websiteUrl ?? providerProfile.websiteUrl,
      });
    }
    res.json(providerProfile);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', ensureAuthenticated, async (req, res, next) => {
  try {
    const providerProfile = await ProviderProfile.findOne({
      where: { id: req.params.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'fullName'] }],
    });
    if (!providerProfile) {
      return res.status(404).json({ error: 'Provider profile not found' });
    }
    res.json(providerProfile);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
