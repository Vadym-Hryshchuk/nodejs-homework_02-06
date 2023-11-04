const express = require("express");
const metod = require("../../models/contacts");
const router = express.Router();
const { validateSchema, putSchema } = require("../../schemas/contacts");

router.get("/", async (req, res, next) => {
  const data = await metod.listContacts();
  data ? res.json(data) : res.status(500).json({ message: "Not found" });
});

router.get("/:contactId", async (req, res, next) => {
  const data = await metod.getContactById(req.params.contactId);
  data ? res.json(data) : next();
});

router.post("/", async (req, res, next) => {
  const response = validateSchema.validate(req.body);

  if (typeof response.error !== "undefined") {
    return res.status(400).json({ message: "missing required name field" });
  }
  const data = await metod.addContact(response.value);
  res.status(201).json(data);
});

router.delete("/:contactId", async (req, res, next) => {
  const data = await metod.removeContact(req.params.contactId);
  data ? res.json({ message: "contact deleted" }) : next();
});

router.put("/:contactId", async (req, res, next) => {
  const response = putSchema.validate(req.body);

  if (Object.keys(response.value).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  }
  if (typeof response.error === "undefined") {
    const data = await metod.updateContact(req.params.contactId, req.body);
    return res.json(data);
  }
  res.json({ message: response.error.details[0].message });
});

module.exports = router;
