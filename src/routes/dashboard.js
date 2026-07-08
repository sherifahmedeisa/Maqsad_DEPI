const express = require('express');
const { Op } = require('sequelize');
const { User, RFP, Proposal, Notification, MatchingScore } = require('../models');
const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/summary', ensureAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const summary = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      metrics: {},
    };

    if (user.role === 'beneficiary') {
      summary.metrics.totalRFPs = await RFP.count({ where: { beneficiaryId: user.id } });
      summary.metrics.openRFPs = await RFP.count({ where: { beneficiaryId: user.id, status: 'open' } });
      summary.metrics.proposalsReceived = await Proposal.count({
        where: { '$rfp.beneficiaryId$': user.id },
        include: [{ model: RFP, as: 'rfp', required: true }],
      });
    } else if (user.role === 'provider') {
      summary.metrics.totalProposals = await Proposal.count({ where: { providerId: user.id } });
      summary.metrics.submittedProposals = await Proposal.count({
        where: { providerId: user.id, status: 'submitted' },
      });
      summary.metrics.recommendedRFPs = await MatchingScore.count({ where: { providerId: user.id } });
    } else {
      summary.metrics.totalUsers = await User.count();
      summary.metrics.totalRFPs = await RFP.count();
      summary.metrics.totalProposals = await Proposal.count();
    }

    summary.metrics.unreadNotifications = await Notification.count({
      where: { userId: user.id, isRead: false },
    });

    res.json(summary);
  } catch (error) {
    next(error);
  }
});

router.get('/feed', ensureAuthenticated, async (req, res, next) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const rfps = await RFP.findAll({
      where: { status: 'open' },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    res.json(rfps);
  } catch (error) {
    next(error);
  }
});

router.get('/notifications', ensureAuthenticated, async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
