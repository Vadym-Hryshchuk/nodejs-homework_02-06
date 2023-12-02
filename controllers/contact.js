const Contact = require("../models/contacts");
const { validateSchema, patchSchema } = require("../schemas/contactsSchema");

const getContactsList = async (req, res, next) => {
  try {
    const { page, limit, favorite } = req.query;

    let searchQuery;
    if (favorite !== undefined) {
      searchQuery = { owner: req.user._id, favorite };
    } else {
      searchQuery = { owner: req.user._id };
    }

    let pagination;

    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      pagination = { skip, limit };
    } else {
      pagination = {};
    }

    const contactsList = await Contact.find(searchQuery, "", pagination).exec();

    res.json(contactsList);
  } catch (error) {
    next(error);
  }
};
const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);

    if (
      contact === null ||
      req.user._id.toString() !== contact.owner._id.toString()
    ) {
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
    const data = await Contact.create({
      ...response.value,
      owner: req.user._id,
    });

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

    const contactInfo = await Contact.findById(contactId);
    if (
      contactInfo === null ||
      req.user._id.toString() !== contactInfo.owner._id.toString()
    ) {
      return next();
    }

    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

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
    const contactInfo = await Contact.findById(contactId);
    if (
      contactInfo === null ||
      req.user._id.toString() !== contactInfo.owner._id.toString()
    ) {
      return next();
    }
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    return res.json(contact);
  } catch (error) {
    next(error);
  }
};
const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactInfo = await Contact.findById(contactId);
    if (
      contactInfo === null ||
      req.user._id.toString() !== contactInfo.owner._id.toString()
    ) {
      return next();
    }
    await Contact.findByIdAndDelete(contactId);

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
