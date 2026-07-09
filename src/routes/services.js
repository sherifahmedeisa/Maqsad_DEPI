const express = require('express');
const { Op } = require('sequelize');
const { Service, User } = require('../models');
const { ensureAuthenticated, ensureRole, ensureOwnerOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const where = { status: 'active' };
    if (req.query.category) where.category = req.query.category;
    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } },
        { tags: { [Op.like]: `%${req.query.search}%` } },
      ];
    }
    
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 50);
    const offset = parseInt(req.query.offset || '0', 10);

    const services = await Service.findAll({
      where,
      include: [{ model: User, as: 'provider', attributes: ['id', 'email', 'fullName'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json(services);
  } catch (error) {
    next(error);
  }
});

router.get('/mine', ensureAuthenticated, ensureRole(['provider']), async (req, res, next) => {
  try {
    const services = await Service.findAll({
      where: { providerId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(services);
  } catch (error) {
    next(error);
  }
});

router.post('/', ensureAuthenticated, ensureRole(['provider']), async (req, res, next) => {
  try {
    // Check free tier limits
    if (req.user.subscriptionTier === 'free') {
      const limit = parseInt(process.env.FREE_TIER_SERVICE_LIMIT || '2', 10);
      const count = await Service.count({ where: { providerId: req.user.id } });
      
      if (count >= limit) {
        return res.status(403).json({ 
          error: 'LIMIT_REACHED', 
          message: 'You have reached the maximum number of free services. To post more services and discuss pricing, please contact our sales at 01061016670.' 
        });
      }
    }

    const {
      title,
      description,
      category,
      price,
      currency,
      tags,
      status
    } = req.body;

    const service = await Service.create({
      providerId: req.user.id,
      title,
      description,
      category,
      price,
      currency: currency || 'USD',
      tags: tags || [],
      status: status || 'active',
    });
    
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [
        { model: User, as: 'provider', attributes: ['id', 'email', 'fullName'] }
      ]
    });
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', ensureOwnerOrAdmin(async (req) => {
  const service = await Service.findByPk(req.params.id);
  return service ? service.providerId : null;
}), async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const { title, description, category, price, currency, tags, status } = req.body;

    await service.update({
      title: title ?? service.title,
      description: description ?? service.description,
      category: category ?? service.category,
      price: price ?? service.price,
      currency: currency ?? service.currency,
      tags: tags ?? service.tags,
      status: status ?? service.status,
    });
    
    res.json(service);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', ensureOwnerOrAdmin(async (req) => {
  const service = await Service.findByPk(req.params.id);
  return service ? service.providerId : null;
}), async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    
    await service.destroy();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [{ model: User, as: 'provider', attributes: ['id', 'email', 'fullName'] }]
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
