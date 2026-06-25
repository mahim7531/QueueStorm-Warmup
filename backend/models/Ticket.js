const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    ticket_id: { type: String, required: true, unique: true },
    channel: { type: String, required: true },
    locale: { type: String, required: true },
    message: { type: String, required: true },
    case_type: { type: String, required: true },
    severity: { type: String, required: true },
    department: { type: String, required: true },
    agent_summary: { type: String, required: true },
    human_review_required: { type: Boolean, required: true },
    confidence: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', TicketSchema);