const crypto = require("crypto");

const expressSession = require("express-session");
const mongoDbStore = require("connect-mongodb-session");

const uri = process.env.MONGODB_URI;

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: uri,
    databaseName: "online-shop",
    collection: "sessions",
  });

  return store;
}

function getSessionSecret() {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }

  // No secret configured: use a random one instead of a value anyone can read in
  // the source. Sessions then end whenever the process restarts.
  console.warn("SESSION_SECRET is not set; using a random secret for this process.");
  return crypto.randomBytes(32).toString("hex");
}

function createSessionConfig() {
  return {
    secret: getSessionSecret(),
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      // "auto" sets Secure whenever the request arrived over HTTPS, so the same
      // build works on plain-HTTP localhost and behind an HTTPS proxy.
      secure: "auto",
    },
  };
}

module.exports = createSessionConfig;
