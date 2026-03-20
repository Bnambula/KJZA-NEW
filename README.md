# Kujaza Fresh — Web Platform

A complete online fresh produce market with customer storefront and admin dashboard.

---

## Quick Start

**Open locally:**
Simply double-click `index.html` — it runs entirely in the browser with no server needed.

**Or serve with a local server (recommended):**
```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```
Then visit: http://localhost:8080

---

## Login Credentials

| Role     | Email                  | Password  |
|----------|------------------------|-----------|
| Admin    | admin@kujaza.com       | admin123  |
| Customer | sarah@email.com        | pass123   |

---

## File Structure

```
kujaza-fresh/
├── index.html          ← Main page (shop + checkout + admin)
├── css/
│   └── style.css       ← All styles
├── js/
│   ├── data.js         ← Data store, seed data, utilities
│   ├── app.js          ← Shop, cart, checkout logic
│   └── admin.js        ← Admin dashboard logic
└── README.md
```

---

## Features

### Customer Storefront
- Browse products by category with search
- Filter by: All, Fresh Fruits, Vegetables, Dried Grains, Other Produce
- Add to cart with quantity control
- Sign up / Sign in
- Full checkout: delivery zone selection (13 zones), payment method, order confirmation

### Admin Dashboard
Sign in as admin to access all sections:

| Section              | What you can do |
|----------------------|-----------------|
| Dashboard            | Live stats, recent orders, low-stock alerts |
| Products             | Add, edit, delete products — name, emoji, category, price, stock, description |
| Categories           | Add, edit, delete product categories |
| Inventory            | View stock levels with visual bars, update stock quantities |
| Orders               | View all orders, change status (Pending → Processing → Out for Delivery → Delivered) |
| Riders               | Add, edit, delete company drivers and outsourced riders |
| Delivery Allocation  | Assign riders to pending orders with one click |
| Finance              | Log income and expenses, live P&L statement with margin |
| Reports              | Sales, Inventory, Rider Performance, Financial Summary reports |
| Customers            | View all registered customer accounts |

---

## Delivery Zones (13)

| Zone       | Fee (UGX) | Phase  |
|------------|-----------|--------|
| Kawempe    | 4,000     | Launch |
| Nakawa     | 4,000     | Launch |
| Bugolobi   | 4,000     | Launch |
| Najjera    | 5,000     | Launch |
| Makindye   | 5,000     | Launch |
| Ndeeba     | 5,000     | Launch |
| Ntinda     | 5,000     | Launch |
| Wakiso     | 7,500     | Launch |
| Mukono     | 10,000    | Expand |
| Kajjansi   | 8,500     | Expand |
| Kitende    | 10,000    | Expand |
| Lubowa     | 10,000    | Expand |
| Entebbe    | 12,500    | Expand |

---

## Payment Methods Supported
- MTN Mobile Money
- Airtel Money
- Cash on Delivery
- Bank Transfer (B2B)

---

## Making It Production-Ready

To turn this into a live website, a developer would need to:

1. **Backend / Database** — Connect to Firebase, Supabase, or a Node.js/PHP backend with a real database (PostgreSQL / MySQL) to persist all data.
2. **Authentication** — Replace in-memory auth with Firebase Auth, Auth0, or a custom JWT system.
3. **Payments** — Integrate MTN MOMO API, Airtel Money API, or Flutterwave for automated payment processing.
4. **Hosting** — Deploy to Netlify, Vercel, or a Ugandan VPS provider. Domain: kujazafresh.com (or similar).
5. **SMS/WhatsApp notifications** — Integrate Africa's Talking SMS API or Twilio WhatsApp API for order confirmations.
6. **Image uploads** — Add Cloudinary or AWS S3 for product photo uploads.

---

## Brand Colours

| Name         | Hex       | Use              |
|--------------|-----------|------------------|
| Forest Green | `#0A4A35` | Primary / Nav    |
| Fresh Green  | `#1D9E75` | Buttons / Accents|
| Light Green  | `#E8F9F3` | Backgrounds      |
| Amber        | `#F59E0B` | Warnings         |

---

*Kujaza Fresh Ltd — Kampala, Uganda — March 2026*
