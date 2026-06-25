const Ticket = require('../models/Ticket');

// Helper function for rule-based matching and evaluation
const analyzeMessage = (message) => {
  const text = message.toLowerCase();

  // Rule 4: Phishing / Social Engineering
  if (/otp|pin|password|scammer|suspicious call/.test(text)) {
    return {
      case_type: 'phishing_or_social_engineering',
      severity: 'critical',
      department: 'fraud_risk',
      human_review_required: true,
      confidence: 0.95,
      summary_template: 'Potential scam or social engineering event reported. Security protocol review initiated.'
    };
  }

  // Rule 1: Wrong Transfer
  if (/wrong number|wrong recipient|sent to wrong person/.test(text)) {
    return {
      case_type: 'wrong_transfer',
      severity: 'high',
      department: 'dispute_resolution',
      human_review_required: true,
      confidence: 0.90,
      summary_template: 'Customer reports sending money to the wrong recipient and requests recovery assistance.'
    };
  }

  // Rule 2: Payment Failed
  if (/payment failed|transaction failed|balance deducted/.test(text)) {
    return {
      case_type: 'payment_failed',
      severity: 'high',
      department: 'payments_ops',
      human_review_required: false,
      confidence: 0.88,
      summary_template: 'Transaction failure reported where balance may have been unexpectedly debited.'
    };
  }

  // Rule 3: Refund Request
  if (/refund|return money/.test(text)) {
    return {
      case_type: 'refund_request',
      severity: 'low',
      department: 'customer_support',
      human_review_required: false,
      confidence: 0.85,
      summary_template: 'Standard customer request for transaction reversal or merchant refund processing.'
    };
  }

  // Rule 5: Fallback (Other)
  return {
    case_type: 'other',
    severity: 'low',
    department: 'customer_support',
    human_review_required: true,
    confidence: 0.50,
    summary_template: 'General inquiry or unclassified request requiring direct support triage.'
  };
};

// Strict Safety Rule Sanitizer
const sanitizeSummary = (summary) => {
  let cleanSummary = summary;
  const sensitivePatterns = [/pin/gi, /otp/gi, /password/gi, /card number/gi];
  
  sensitivePatterns.forEach((pattern) => {
    if (pattern.test(cleanSummary)) {
      cleanSummary = cleanSummary.replace(pattern, '[REDACTED SENSITIVE TERM]');
    }
  });
  return cleanSummary;
};

exports.sortTicket = async (req, res, next) => {
  try {
    const { ticket_id, channel, locale, message } = req.body;

    if (!ticket_id || !channel || !locale || !message) {
      return res.status(400).json({ error: 'Bad Request', message: 'Missing required parameters.' });
    }

    // Evaluate text using our NLP rules
    const analysis = analyzeMessage(message);
    const safeSummary = sanitizeSummary(analysis.summary_template);

    const ticketData = {
      ticket_id,
      channel,
      locale,
      message,
      case_type: analysis.case_type,
      severity: analysis.severity,
      department: analysis.department,
      agent_summary: safeSummary,
      human_review_required: analysis.human_review_required,
      confidence: analysis.confidence
    };

    // Save transactionally to MongoDB
    const ticket = new Ticket(ticketData);
    await ticket.save();

    return res.status(200).json(ticketData);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Conflict', message: 'Ticket ID already exists.' });
    }
    next(error);
  }
};