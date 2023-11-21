const express = require("express");
const contactsController = require("../../controllers/contact");
const isValidId = require("../../middlewares/isValidId");

const router = express.Router();

router.get("/", contactsController.getContactsList);

router.get("/:contactId", isValidId, contactsController.getContactById);

router.post("/", contactsController.addContact);

router.delete("/:contactId", isValidId, contactsController.removeContact);

router.put("/:contactId", isValidId, contactsController.updateContactById);

router.patch(
  "/:contactId/favorite",
  isValidId,
  contactsController.updateStatusContact
);

module.exports = router;
