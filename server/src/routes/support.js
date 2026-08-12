const express = require('express');
const router = express.Router();
const { createTicket, getUserTickets, getTicketDetails, replyToTicket } = require('../controllers/support');
const { protect } = require('../middleware/auth');

router.post('/tickets', protect, createTicket);
router.get('/tickets', protect, getUserTickets);
router.get('/tickets/:id', protect, getTicketDetails);
router.post('/tickets/:id/reply', protect, replyToTicket);

module.exports = router;
