const express = require('express');

const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/signup', authController.getSignup);

router.post('/signup', authController.signup);

router.get('/login', authController.getLogin);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/login/otp', authController.getOtpRequest);

router.post('/login/otp/request', authController.requestOtp);

router.get('/login/otp/verify', authController.getOtpVerify);

router.post('/login/otp/verify', authController.verifyOtp);

module.exports = router;