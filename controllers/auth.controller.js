const User = require('../models/user.model');
const Otp = require('../models/otp.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');
const sendOtpEmail = require('../utils/otpEmail');

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      street: '',
      postal: '',
      city: '',
    };
  }

  res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: res.locals.t('auth.invalidSignupMessage'),
        ...enteredData,
      },
      function () {
        res.redirect('/signup');
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: res.locals.t('auth.userExistsMessage'),
          ...enteredData,
        },
        function () {
          res.redirect('/signup');
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/login');
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      password: '',
    };
  }

  res.render('customer/auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
  const sessionErrorData = {
    errorMessage: res.locals.t('auth.invalidCredentialsMessage'),
    email: typeof req.body.email === 'string' ? req.body.email : '',
    password: typeof req.body.password === 'string' ? req.body.password : '',
  };

  if (
    typeof req.body.email !== 'string' ||
    typeof req.body.password !== 'string'
  ) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
    return;
  }

  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/');
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
}

function getOtpRequest(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = { email: '' };
  }

  res.render('customer/auth/otp-request', { inputData: sessionData });
}

async function requestOtp(req, res, next) {
  const email = typeof req.body.email === 'string' ? req.body.email : '';

  if (!email.includes('@')) {
    sessionFlash.flashDataToSession(
      req,
      { errorMessage: res.locals.t('auth.otpInvalidEmailMessage'), email: email },
      function () {
        res.redirect('/login/otp');
      }
    );
    return;
  }

  try {
    const user = new User(email, '');
    const existingUser = await user.getUserWithSameEmail();

    // Only ever send a code for accounts that actually exist, but always
    // redirect the same way regardless - so this endpoint can't be used to
    // enumerate which emails are registered.
    if (existingUser) {
      const code = await Otp.create(email);
      await sendOtpEmail(email, code);
    }
  } catch (error) {
    next(error);
    return;
  }

  res.redirect(`/login/otp/verify?email=${encodeURIComponent(email)}`);
}

function getOtpVerify(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  const email = typeof req.query.email === 'string' ? req.query.email : '';

  if (!sessionData) {
    sessionData = { email: email, code: '' };
  }

  res.render('customer/auth/otp-verify', { inputData: sessionData });
}

async function verifyOtp(req, res, next) {
  const email = typeof req.body.email === 'string' ? req.body.email : '';
  const code = typeof req.body.code === 'string' ? req.body.code : '';

  const sessionErrorData = {
    errorMessage: res.locals.t('auth.otpInvalidCodeMessage'),
    email: email,
    code: '',
  };

  if (!email || !code) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect(`/login/otp/verify?email=${encodeURIComponent(email)}`);
    });
    return;
  }

  let result;
  let existingUser;
  try {
    result = await Otp.verify(email, code);

    if (result.success) {
      const user = new User(email, '');
      existingUser = await user.getUserWithSameEmail();
    }
  } catch (error) {
    next(error);
    return;
  }

  if (!result.success || !existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect(`/login/otp/verify?email=${encodeURIComponent(email)}`);
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/');
  });
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
  getOtpRequest: getOtpRequest,
  requestOtp: requestOtp,
  getOtpVerify: getOtpVerify,
  verifyOtp: verifyOtp,
};
