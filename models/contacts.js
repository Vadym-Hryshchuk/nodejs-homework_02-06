const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "contacts.json");

async function readContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
  }
}

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}
const listContacts = async () => {
  return await readContacts();
};

const getContactById = async (contactId) => {
  try {
    const data = await readContacts();
    const contact = data.find((contact) => contact.id === contactId);
    return contact || null;
  } catch (error) {
    console.error(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await readContacts();
    const index = data.findIndex((item) => item.id === contactId);

    if (index === -1) {
      return null;
    }
    const removedContacts = data[index];
    data.splice(index, 1);

    await writeContacts(data);
    return removedContacts;
  } catch (error) {
    console.error(error);
  }
};

const addContact = async (reqBody) => {
  try {
    const data = await readContacts();
    const newContact = { id: crypto.randomUUID(), ...reqBody };
    data.push(newContact);

    await writeContacts(data);
    return newContact;
  } catch (error) {
    console.error(error);
  }
};

const updateContact = async (contactId, { name, email, phone }) => {
  try {
    const data = await readContacts();
    const index = data.findIndex((item) => item.id === contactId);
    if (index === -1) {
      return null;
    }
    data[index] = {
      contactId,
      name: name || data[index].name,
      email: email || data[index].email,
      phone: phone || data[index].phone,
    };

    await writeContacts(data);
    return data[index];
  } catch (error) {
    console.error(error);
  }
};

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };
