const SupportTicket = require('../models/SupportTicket');
const SupportMessage = require('../models/SupportMessage');
const Notification = require('../models/Notification');

// Generate unique Ticket ID
const generateTicketId = () => {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `ST-${rand}`;
};

// @desc    Create a new support ticket
// @route   POST /api/support/tickets
// @access  Private
exports.createTicket = async (req, res, next) => {
  try {
    const { subject, category, priority, message } = req.body;

    if (!subject || !category || !message) {
      return res.status(400).json({ error: 'Subject, category, and message are required' });
    }

    const ticket_number = generateTicketId();

    // Create Ticket
    const ticket = await SupportTicket.create({
      ticket_number,
      user: req.user._id,
      subject,
      category,
      priority: priority || 'MEDIUM',
      status: 'OPEN'
    });

    // Create Initial Message
    await SupportMessage.create({
      ticket: ticket._id,
      sender: req.user._id,
      sender_type: 'USER',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket opened successfully',
      ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's tickets
// @route   GET /api/support/tickets
// @access  Private
exports.getUserTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket details and message thread
// @route   GET /api/support/tickets/:id
// @access  Private
exports.getTicketDetails = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findOne({ _id: req.params.id, user: req.user._id });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const messages = await SupportMessage.find({ ticket: ticket._id }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      ticket,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a support ticket
// @route   POST /api/support/tickets/:id/reply
// @access  Private
exports.replyToTicket = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Reply message text is required' });
    }

    const ticket = await SupportTicket.findOne({ _id: req.params.id, user: req.user._id });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Set ticket status back to OPEN
    ticket.status = 'OPEN';
    await ticket.save();

    // Create Message
    const supportMessage = await SupportMessage.create({
      ticket: ticket._id,
      sender: req.user._id,
      sender_type: 'USER',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      supportMessage
    });
  } catch (error) {
    next(error);
  }
};
