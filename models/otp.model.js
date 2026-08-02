const crypto = require('crypto');

const db = require('../data/database');

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function generateCode() {
  return String(crypto.randomInt(100000, 1000000));
}

class Otp {
  static async create(email) {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    // Only one pending code per email at a time - requesting a new one
    // invalidates whatever was issued before it.
    await db.getDb().collection('otps').deleteMany({ email: email });
    await db.getDb().collection('otps').insertOne({
      email: email,
      code: code,
      expiresAt: expiresAt,
      attempts: 0,
    });

    return code;
  }

  static async verify(email, submittedCode) {
    const record = await db.getDb().collection('otps').findOne({ email: email });

    if (!record) {
      return { success: false, reason: 'not_found' };
    }

    if (record.expiresAt < new Date()) {
      await db.getDb().collection('otps').deleteOne({ _id: record._id });
      return { success: false, reason: 'expired' };
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      await db.getDb().collection('otps').deleteOne({ _id: record._id });
      return { success: false, reason: 'too_many_attempts' };
    }

    if (record.code !== submittedCode) {
      await db.getDb().collection('otps').updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
      return { success: false, reason: 'invalid_code' };
    }

    await db.getDb().collection('otps').deleteOne({ _id: record._id });
    return { success: true };
  }
}

module.exports = Otp;
