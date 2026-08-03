<h1 align="center"> WDE </h1>

<p align="center"> WDE Shop - a full-stack e-commerce demo application</p>

<p align="center">
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-project">Project</a>&nbsp;&nbsp;&nbsp;

<br>

<p align="center">
  <img alt="admin main page" src="github\admin-main-page.png" width="100%">
</p>

<p align="center">
  <img alt="product form" src="github\product-form.png" width="100%">
</p>

<p align="center">
  <img alt="order management" src="github\order-management.png" width="100%">
</p>

<p align="center">
  <img alt="main page" src="github\main-page.png" width="50%"><img alt="mobile nav" src="github\mobile-nav.png" width="50%">
</p>

<p align="center">
  <img alt="cart" src="github\cart.png" width="50%"><img alt="stripe checkout" src="github\stripe.png" width="50%">
</p>

<p align="center">
  <img alt="payment success" src="github\payment-success.png" width="50%"><img alt="orders" src="github\orders.png" width="50%">
</p>

</p>

## 🚀 Technologies

This project is built with:

- EJS and CSS (vanilla, no frontend framework or bundler)
- JavaScript, Ajax and Node.js
- MongoDB
- Stripe (test-mode checkout)
- Mailpit (local SMTP catcher for order confirmation and OTP login emails)
- Self-hosted vendor libraries: flatpickr (date picker), Quill (rich text editor)
- Git and GitHub

## 💻 Project

WDE Shop is an e-commerce store with two access levels, available in English and Brazilian Portuguese (language selector in the nav bar):

Administrator:

- Add, edit and delete products - including a rich text description editor (sanitized server-side against stored XSS), a launch-date picker, and drag-and-drop image upload
- Manage orders in a sortable table (click any column to sort)
- Desktop-optimized interface

Customer:

- Browse the catalog with department filtering, name/price sorting, and a live search combobox
- View product details and add products to the cart
- Pay through the Stripe API (test mode)
- Track the status of past orders, download a PDF invoice for any of them
- Log in with a password, or with a one-time code emailed via Mailpit (no password required)
- Receive an order confirmation email after a successful purchase
- Mobile-optimized design

## 🐳 Running locally with Docker

Prerequisites: [Docker Desktop](https://www.docker.com/products/docker-desktop/).

1. Copy the example environment file and fill in your Stripe test key:

   ```bash
   cp .env.example .env
   # edit .env and set STRIPE_KEY to a test key (sk_test_...) from your Stripe account
   ```

2. Bring up the containers (app + MongoDB + Mailpit). On first run, a `seed` service populates the database automatically:

   ```bash
   docker compose up --build
   ```

3. Visit [http://localhost:3000](http://localhost:3000).

Credentials already seeded:

| Role     | Email              | Password |
| -------- | ------------------ | -------- |
| Admin    | admin@test.com      | tester   |
| Customer | user2@example.com   | usertest |

The seed script also creates a full sample catalog (24 products across 6 departments, including the "GTRACING - Black Gaming Chair") and a pending order, so the application comes up ready to use and ready for automated testing.

MongoDB is reachable at `127.0.0.1:27017` (loopback only) — used by the [`wde-test-automation`](https://github.com/Gabriel-Leao51/wde-test-automation) suite's security proof-of-concept for `BUG-SEC-005`, and handy for inspecting the database locally with any MongoDB client.

Mailpit's web UI is reachable at [http://localhost:8025](http://localhost:8025) — every order confirmation and OTP login-code email sent by the app locally ends up there (no real SMTP provider or account needed).

To fully reset the data (removes the MongoDB volume):

```bash
docker compose down -v
```

## 🧪 Automated Testing

This application is the target under test for a companion end-to-end test suite, [`wde-test-automation`](https://github.com/Gabriel-Leao51/wde-test-automation) (Playwright + pytest-bdd), covering functional, security, visual regression, and E2E scenarios across the full feature set described above.
