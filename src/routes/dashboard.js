const express = require('express');
const { Op } = require('sequelize');
const { User, RFP, Proposal, Notification, MatchingScore, MessageThread, Message } = require('../models');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');
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
      include: [{ model: User, as: 'beneficiary', attributes: ['id', 'email', 'fullName'] }],
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

router.get('/reports', ensureAuthenticated, ensureRole(['admin']), async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const beneficiariesCount = await User.count({ where: { role: 'beneficiary' } });
    const providersCount = await User.count({ where: { role: 'provider' } });
    const adminsCount = await User.count({ where: { role: 'admin' } });
    const activeUsersCount = await User.count({ where: { accountStatus: 'active' } });
    const suspendedUsersCount = await User.count({ where: { accountStatus: 'suspended' } });
    const pendingUsersCount = await User.count({ where: { accountStatus: 'pending' } });

    const totalRFPs = await RFP.count();
    const draftRFPs = await RFP.count({ where: { status: 'draft' } });
    const openRFPs = await RFP.count({ where: { status: 'open' } });
    const underReviewRFPs = await RFP.count({ where: { status: 'under_review' } });
    const closedRFPs = await RFP.count({ where: { status: 'closed' } });
    const cancelledRFPs = await RFP.count({ where: { status: 'cancelled' } });

    const totalProposals = await Proposal.count();
    const submittedProposals = await Proposal.count({ where: { status: 'submitted' } });
    const shortlistedProposals = await Proposal.count({ where: { status: 'shortlisted' } });
    const acceptedProposals = await Proposal.count({ where: { status: 'accepted' } });
    const rejectedProposals = await Proposal.count({ where: { status: 'rejected' } });
    const withdrawnProposals = await Proposal.count({ where: { status: 'withdrawn' } });

    const totalMessageThreads = await MessageThread.count();
    const totalMessages = await Message.count();

    res.json({
      timestamp: new Date(),
      users: {
        total: totalUsers,
        byRole: {
          beneficiary: beneficiariesCount,
          provider: providersCount,
          admin: adminsCount,
        },
        byStatus: {
          active: activeUsersCount,
          suspended: suspendedUsersCount,
          pending: pendingUsersCount,
        },
      },
      rfps: {
        total: totalRFPs,
        byStatus: {
          draft: draftRFPs,
          open: openRFPs,
          under_review: underReviewRFPs,
          closed: closedRFPs,
          cancelled: cancelledRFPs,
        },
      },
      proposals: {
        total: totalProposals,
        byStatus: {
          submitted: submittedProposals,
          shortlisted: shortlistedProposals,
          accepted: acceptedProposals,
          rejected: rejectedProposals,
          withdrawn: withdrawnProposals,
        },
      },
      messaging: {
        totalThreads: totalMessageThreads,
        totalMessages: totalMessages,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
