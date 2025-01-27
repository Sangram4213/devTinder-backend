const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 4 || firstName.length > 50)
    throw new Error("FirstName should be 4-50 characters");
  else if (!validator.isEmail(emailId)) throw new Error("EmailId is not valid");
  else if (!validator.isStrongPassword(password))
    throw new Error("Password is not valid");
};

module.exports = { validateSignUpData };
