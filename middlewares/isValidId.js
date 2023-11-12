const { isValidObjectId } = require("mongoose");

const HttpError = (message) => {
  const error = new Error(message);
  //   error.status = status;
  return error;
};

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    next(HttpError(`${contactId} is not valid id`));
  }

  next();
};

module.exports = isValidId;
