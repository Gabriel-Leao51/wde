require("dotenv").config();

const path = require("path");

const express = require("express");
const csrf = require("csurf");
const helmet = require("helmet");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const localeMiddleware = require("./middlewares/locale");
const themeMiddleware = require("./middlewares/theme");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const parseAdminMultipartMiddleware = require("./middlewares/admin-multipart");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");
const notFoundMiddleware = require("./middlewares/not-found");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

app.disable("x-powered-by");

// Behind an HTTPS proxy (Render) the app sees plain HTTP; trust its forwarded
// protocol so Secure session cookies are set. Off by default.
if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  helmet({
    // /lang/:code redirects back using the Referer, so same-origin requests must send it.
    referrerPolicy: { policy: "same-origin" },
    // The app opens no cross-origin popups, and same-origin COOP makes Firefox swap browsing
    // context groups on navigation, which drops Playwright's emulated colour scheme.
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // Checkout posts a form and is redirected to Stripe's hosted page.
        "form-action": ["'self'", "https://checkout.stripe.com"],
        // Would rewrite every asset to https on plain-HTTP localhost.
        "upgrade-insecure-requests": null,
      },
    },
  })
);

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(themeMiddleware);

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(checkAuthStatusMiddleware);

app.use("/admin/products", parseAdminMultipartMiddleware);

app.use(csrf());

app.use(localeMiddleware);

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", protectRoutesMiddleware, ordersRoutes);
app.use("/admin", protectRoutesMiddleware, adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
