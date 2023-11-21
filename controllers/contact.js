const Contact = require("../models/contacts");
const { validateSchema, patchSchema } = require("../schemas/contactsSchema");

const getContactsList = async (req, res, next) => {
  try {
    const contactsList = await Contact.find().exec();

    res.json(contactsList);
  } catch (error) {
    next(error);
  }
};
const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);
    if (contact === null) {
      return next();
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};
const addContact = async (req, res, next) => {
  try {
    const response = validateSchema.validate(req.body);
    if (typeof response.error !== "undefined") {
      return res.status(400).json({ message: response.error.message });
    }
    const data = await Contact.create(response.value);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
const updateContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const response = validateSchema.validate(req.body);
    const isEmptyRequest = Object.keys(response.value).length === 0;

    if (isEmptyRequest) {
      return res.status(400).json({ message: "missing fields" });
    }
    if (typeof response.error !== "undefined") {
      const err = response.error.details.map((err) => err.message).join(", ");
      return res.json({ message: err });
    }
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (contact === null) {
      return next();
    }
    return res.json(contact);
  } catch (error) {
    next(error);
  }
};
const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const response = patchSchema.validate(req.body);
    const isEmptyRequest = Object.keys(response.value).length === 0;

    if (isEmptyRequest) {
      return res.status(400).json({ message: "missing field favorite" });
    }
    if (typeof response.error !== "undefined") {
      const err = response.error.details.map((err) => err.message).join(", ");
      return res.json({ message: err });
    }

    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (contact === null) {
      return next();
    }
    return res.json(contact);
  } catch (error) {
    next(error);
  }
};
const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndDelete(contactId);

    if (contact === null) {
      return next();
    }
    return res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContactsList,
  getContactById,
  addContact,
  updateContactById,
  updateStatusContact,
  removeContact,
};
