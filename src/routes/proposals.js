const express = require('express');
const { Proposal, RFP, User } = require('../models');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');
const router = express.Router();

router.get('/mine', ensureAuthenticated, ensureRole(['provider']), async (req, res, next) => {
  try {
    const proposals = await Proposal.findAll({
      where: { providerId: req.user.id },
      include: [
        { model: RFP, as: 'rfp' },
      ],
      order: [['updatedAt', 'DESC']],
    });
    res.json(proposals);
  } catch (error) {
    next(error);
  }
});

router.get('/received', ensureAuthenticated, ensureRole(['beneficiary']), async (req, res, next) => {
  try {
    const proposals = await Proposal.findAll({
      include: [
        {
          model: RFP,
          as: 'rfp',
          where: { beneficiaryId: req.user.id }
        },
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'email', 'fullName']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });
    res.json(proposals);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', ensureAuthenticated, async (req, res, next) => {
  try {
    const proposal = await Proposal.findByPk(req.params.id, {
      include: [
        { model: RFP, as: 'rfp' },
        { model: User, as: 'provider', attributes: ['id', 'email', 'fullName'] },
      ],
    });
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    if (req.user.role === 'provider' && proposal.providerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(proposal);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', ensureAuthenticated, ensureRole(['provider']), async (req, res, next) => {
  try {
    const proposal = await Proposal.findByPk(req.params.id);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    if (proposal.providerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const {
      coverLetter,
      proposedBudget,
      currency,
      estimatedDays,
      attachmentUrl,
      status,
    } = req.body;

    await proposal.update({
      coverLetter: coverLetter ?? proposal.coverLetter,
      proposedBudget: proposedBudget ?? proposal.proposedBudget,
      currency: currency ?? proposal.currency,
      estimatedDays: estimatedDays ?? proposal.estimatedDays,
      attachmentUrl: attachmentUrl ?? proposal.attachmentUrl,
      status: status ?? proposal.status,
    });

    res.json(proposal);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', ensureAuthenticated, async (req, res, next) => {
  try {
    const proposal = await Proposal.findByPk(req.params.id, { include: [{ model: RFP, as: 'rfp' }] });
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatus = ['submitted', 'shortlisted', 'accepted', 'rejected', 'withdrawn'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: 'Invalid proposal status' });
    }

    if (req.user.role === 'provider' && proposal.providerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.user.role === 'beneficiary' && proposal.rfp.beneficiaryId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.user.role === 'beneficiary' && ['shortlisted', 'accepted', 'rejected'].includes(status)) {
      await proposal.update({ status });
      return res.json(proposal);
    }

    if (req.user.role === 'provider' && status === 'withdrawn') {
      await proposal.update({ status });
      return res.json(proposal);
    }

    res.status(403).json({ error: 'Forbidden to change to that status' });
  } catch (error) {
    next(error);
  }
});

router.get('/rfp/:rfpId', ensureAuthenticated, async (req, res, next) => {
  try {
    const rfp = await RFP.findByPk(req.params.rfpId);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    if (req.user.role === 'beneficiary' && rfp.beneficiaryId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const proposals = await Proposal.findAll({
      where: { rfpId: rfp.id },
      include: [{ model: User, as: 'provider', attributes: ['id', 'email', 'fullName'] }],
    });
    res.json(proposals);
  } catch (error) {
    next(error);
  }
});

router.get('/', ensureAuthenticated, ensureRole(['admin']), async (req, res, next) => {
  try {
    const proposals = await Proposal.findAll({
      include: [
        { model: RFP, as: 'rfp' },
        { model: User, as: 'provider', attributes: ['id', 'email', 'fullName'] },
      ],
      order: [['updatedAt', 'DESC']],
    });
    res.json(proposals);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', ensureAuthenticated, ensureRole(['admin']), async (req, res, next) => {
  try {
    const proposal = await Proposal.findByPk(req.params.id);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    await proposal.destroy();
    res.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
