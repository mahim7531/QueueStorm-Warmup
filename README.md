# ⚡ QueueStorm Ticket Analyzer

QueueStorm Ticket Analyzer is an automated customer support ticket classification web service built for the **bKash CSE Carnival 2026 Hackathon** mock preliminary task.

The application parses raw customer text complaints using a rule-based NLP structure to instantly determine the case type, severity level, target department, and whether human review is required.

---

## 🚀 Features

* **Intelligent NLP Engine:** Automatically classifies complaints into categories like `wrong_transfer`, `payment_failed`, `refund_request`, and `phishing_or_social_engineering`.
* **Data Safety Enforcer:** Strictly ensures that sensitive customer data (PIN, OTP, Passwords, Card numbers) is never generated or shared in summaries.
* **Modern Dark UI Dashboard:** A fully responsive, clean dashboard UI built with React and Vite.
* **Production Ready:** Includes full Mongoose database integration and Multi-stage production Docker configurations.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Axios, Custom CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB & Mongoose

---

## 📂 Project Structure

```text
queue-storm-mern/
├── backend/
│   ├── controllers/      # NLP Classification & Business Logic
│   ├── models/           # Mongoose Ticket Schema
│   ├── routes/           # Express API Endpoints
│   ├── .env              # Environment Configuration
│   └── server.js         # Backend Entry Point
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Dashboard UI Components
│   │   └── main.jsx
│   └── vite.config.js
└── README.md
