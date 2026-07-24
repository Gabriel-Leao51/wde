function isEmpty(value) {
  return typeof value !== 'string' || value.trim() === '';
}

function userCredentialsAreValid(email, password) {
  return (
    typeof email === 'string' &&
    typeof password === 'string' &&
    email.includes('@') &&
    password.trim().length >= 6
  );
}

function userDetailsAreValid(email, password, name, street, postal, city) {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
  );
}

function emailIsConfirmed(email, confirmEmail) {
  return email === confirmEmail;
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed,
};
