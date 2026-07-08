const express = require('express');
const { MessageThread, Message, User, RFP } = require('../models');
const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();

// List all chat threads for the current user
router.get('/threads', ensureAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find all threads where the user is either beneficiary or provider
    const threads = await MessageThread.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { beneficiaryId: userId },
          { providerId: userId },
        ],
      },
      include: [
        { model: RFP, as: 'rfp', attributes: ['id', 'title'] },
        { model: User, as: 'beneficiary', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'provider', attributes: ['id', 'fullName', 'email'] },
      ],
      order: [['lastMessageAt', 'DESC']],
    });

    res.json(threads);
  } catch (error) {
    next(error);
  }
});

// Get messages for a specific thread
router.get('/threads/:id/messages', ensureAuthenticated, async (req, res, next) => {
  try {
    const thread = await MessageThread.findByPk(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Auth check: user must be part of the thread
    if (thread.beneficiaryId !== req.user.id && thread.providerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const messages = await Message.findAll({
      where: { threadId: thread.id },
      order: [['sentAt', 'ASC']],
    });

    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// Find or create thread and fetch its messages
router.get('/thread-by-context', ensureAuthenticated, async (req, res, next) => {
  try {
    const { rfpId, targetUserId } = req.query;
    if (!rfpId || !targetUserId) {
      return res.status(400).json({ error: 'rfpId and targetUserId are required' });
    }

    const rfp = await RFP.findByPk(rfpId);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    let beneficiaryId, providerId;
    if (req.user.role === 'beneficiary') {
      beneficiaryId = req.user.id;
      providerId = targetUserId;
    } else {
      beneficiaryId = rfp.beneficiaryId;
      providerId = req.user.id;
    }

    // Find or create the thread
    const [thread] = await MessageThread.findOrCreate({
      where: { rfpId, beneficiaryId, providerId },
    });

    const messages = await Message.findAll({
      where: { threadId: thread.id },
      order: [['sentAt', 'ASC']],
    });

    res.json({ thread, messages });
  } catch (error) {
    next(error);
  }
});

// Send a message
router.post('/send', ensureAuthenticated, async (req, res, next) => {
  try {
    const { rfpId, body, targetUserId } = req.body;
    if (!rfpId || !body || !targetUserId) {
      return res.status(400).json({ error: 'rfpId, body, and targetUserId are required' });
    }

    const rfp = await RFP.findByPk(rfpId);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    let beneficiaryId, providerId;
    if (req.user.role === 'beneficiary') {
      beneficiaryId = req.user.id;
      providerId = targetUserId;
    } else {
      beneficiaryId = rfp.beneficiaryId;
      providerId = req.user.id;
    }

    // Find or create thread
    const [thread] = await MessageThread.findOrCreate({
      where: { rfpId, beneficiaryId, providerId },
    });

    // Create the message
    const message = await Message.create({
      threadId: thread.id,
      senderId: req.user.id,
      body,
      sentAt: new Date(),
    });

    // Update thread timestamp
    thread.lastMessageAt = new Date();
    await thread.save();

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
