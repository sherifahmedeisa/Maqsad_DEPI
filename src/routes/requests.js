const express = require('express');
const { Op } = require('sequelize');
const { RFP, Proposal, User } = require('../models');
const { ensureAuthenticated, ensureRole, ensureOwnerOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.category) where.category = req.query.category;
    if (req.query.beneficiaryId) where.beneficiaryId = req.query.beneficiaryId;
    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } },
      ];
    }
    if (req.query.tag) {
      where.tags = { [Op.like]: `%"${req.query.tag}"%` };
    }

    const limit = Math.min(parseInt(req.query.limit || '20', 10), 50);
    const offset = parseInt(req.query.offset || '0', 10);

    const rfps = await RFP.findAll({
      where,
      include: [{ model: User, as: 'beneficiary', attributes: ['id', 'email', 'fullName'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json(rfps);
  } catch (error) {
    next(error);
  }
});

router.get('/me', ensureAuthenticated, async (req, res, next) => {
  try {
    const rfps = await RFP.findAll({
      where: { beneficiaryId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(rfps);
  } catch (error) {
    next(error);
  }
});

router.post('/', ensureAuthenticated, ensureRole(['provider']), async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      budgetMin,
      budgetMax,
      currency,
      deadline,
      status,
      attachmentUrl,
    } = req.body;

    const rfp = await RFP.create({
      beneficiaryId: req.user.id,
      title,
      description,
      category,
      tags,
      budgetMin,
      budgetMax,
      currency,
      deadline: deadline ? new Date(deadline) : null,
      status: status || 'draft',
      attachmentUrl,
      publishedAt: status === 'open' ? new Date() : null,
    });
    res.status(201).json(rfp);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', ensureAuthenticated, async (req, res, next) => {
  try {
    const rfp = await RFP.findByPk(req.params.id, {
      include: [
        { model: User, as: 'beneficiary', attributes: ['id', 'email', 'fullName'] },
        { model: Proposal, as: 'proposals' },
      ],
    });
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }
    res.json(rfp);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', ensureOwnerOrAdmin(async (req) => {
  const rfp = await RFP.findByPk(req.params.id);
  return rfp ? rfp.beneficiaryId : null;
}), async (req, res, next) => {
  try {
    const rfp = await RFP.findByPk(req.params.id);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    const {
      title,
      description,
      category,
      tags,
      budgetMin,
      budgetMax,
      currency,
      deadline,
      status,
      attachmentUrl,
    } = req.body;

    await rfp.update({
      title: title ?? rfp.title,
      description: description ?? rfp.description,
      category: category ?? rfp.category,
      tags: tags ?? rfp.tags,
      budgetMin: budgetMin ?? rfp.budgetMin,
      budgetMax: budgetMax ?? rfp.budgetMax,
      currency: currency ?? rfp.currency,
      deadline: deadline ? new Date(deadline) : rfp.deadline,
      status: status ?? rfp.status,
      attachmentUrl: attachmentUrl ?? rfp.attachmentUrl,
      publishedAt: status === 'open' && !rfp.publishedAt ? new Date() : rfp.publishedAt,
    });
    res.json(rfp);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/proposals', ensureAuthenticated, ensureRole(['beneficiary']), async (req, res, next) => {
  try {
    const rfp = await RFP.findByPk(req.params.id);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    const {
      coverLetter,
      proposedBudget,
      currency,
      estimatedDays,
      attachmentUrl,
      status,
    } = req.body;

    const proposal = await Proposal.create({
      rfpId: rfp.id,
      providerId: req.user.id,
      coverLetter,
      proposedBudget,
      currency,
      estimatedDays,
      attachmentUrl,
      status: status || 'submitted',
      submittedAt: new Date(),
    });
    res.status(201).json(proposal);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/proposals', ensureAuthenticated, async (req, res, next) => {
  try {
    const rfp = await RFP.findByPk(req.params.id);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    if (req.user.role === 'beneficiary' && rfp.beneficiaryId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const where = { rfpId: rfp.id };
    if (req.user.role === 'provider') {
      where.providerId = req.user.id;
    }

    const proposals = await Proposal.findAll({
      where,
      include: [{ model: User, as: 'provider', attributes: ['id', 'email', 'fullName'] }],
      order: [['updatedAt', 'DESC']],
    });
    res.json(proposals);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', ensureAuthenticated, ensureRole(['admin']), async (req, res, next) => {
  try {
    const rfp = await RFP.findByPk(req.params.id);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }
    await Proposal.destroy({ where: { rfpId: rfp.id } });
    await rfp.destroy();
    res.json({ message: 'RFP deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
