const express = require("express");
// const metod = require("../../models/contacts");
const router = express.Router();
const contactsController = require("../../controllers/contact");
const isValidId = require("../../middlewares/isValidId");

// router.get("/", async (req, res, next) => {
//   const data = await metod.listContacts();
//   data ? res.json(data) : res.status(500).json({ message: "Not found" });
// });
router.get("/", contactsController.getContactsList);

// router.get("/:contactId", async (req, res, next) => {
//   const data = await metod.getContactById(req.params.contactId);
//   data ? res.json(data) : next();
// });
router.get("/:contactId", isValidId, contactsController.getContactById);

// router.post("/", async (req, res, next) => {
//   const response = validateSchema.validate(req.body);

//   if (typeof response.error !== "undefined") {
//     return res.status(400).json({ message: "missing required name field" });
//   }
//   const data = await metod.addContact(response.value);
//   res.status(201).json(data);
// });
router.post("/", contactsController.addContact);

// router.delete("/:contactId", async (req, res, next) => {
//   const data = await metod.removeContact(req.params.contactId);
//   data ? res.json({ message: "contact deleted" }) : next();
// });
router.delete("/:contactId", isValidId, contactsController.removeContact);

// router.put("/:contactId", isValidId, async (req, res, next) => {
//   const response = putSchema.validate(req.body);

//   if (Object.keys(response.value).length === 0) {
//     return res.status(400).json({ message: "missing fields" });
//   }
//   if (typeof response.error === "undefined") {
//     const data = await metod.updateContact(req.params.contactId, req.body);
//     return res.json(data);
//   }
//   res.json({ message: response.error.details[0].message });
// });
router.put("/:contactId", isValidId, contactsController.updateContactById);
router.patch("/:contactId", isValidId, contactsController.updateStatusContact);

module.exports = router;
