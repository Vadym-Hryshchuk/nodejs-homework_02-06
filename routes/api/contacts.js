const express = require("express");
const contactsController = require("../../controllers/contact");
const isValidId = require("../../middlewares/isValidId");
const isAuth = require("../../middlewares/isAuth");

const router = express.Router();

router.get("/", isAuth, contactsController.getContactsList);

router.get("/:contactId", isAuth, isValidId, contactsController.getContactById);

router.post("/", isAuth, contactsController.addContact);

router.delete(
  "/:contactId",
  isAuth,
  isValidId,
  contactsController.removeContact
);

router.put(
  "/:contactId",
  isAuth,
  isValidId,
  contactsController.updateContactById
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  contactsController.updateStatusContact
);

module.exports = router;
