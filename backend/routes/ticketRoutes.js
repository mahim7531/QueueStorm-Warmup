const express = require('express');
const router = express.Router();
const { sortTicket } = require('../controllers/ticketController');

router.post('/sort-ticket', sortTicket);

module.exports = router;