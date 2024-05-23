import mongoose from "mongoose";
import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

export async function listContacts() {
  return await Contact.find();
}

export async function getContactById(contactId) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new HttpError(400, "Invalid ID");
  }
  return await Contact.findById(contactId);
}

export async function removeContact(contactId) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new HttpError(400, "Invalid ID");
  }

  const result = await Contact.deleteOne({ _id: contactId });
  if (result.deletedCount === 0) {
    throw new HttpError(404, "Contact not found");
  }
  return { message: "Contact removed" };
}

export async function addContact({ name, email, phone, favorite = false }) {
  return await Contact.create({ name, email, phone, favorite });
}

export async function updateContact(id, body) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, "Invalid ID");
  }
  const contact = await Contact.findByIdAndUpdate(id, body, { new: true });
  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }
  return contact;
}

export async function updateStatusContact(id, body) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, "Invalid ID");
  }
  const contact = await Contact.findByIdAndUpdate(
    id,
    { favorite: body.favorite },
    { new: true }
  );
  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }
  return contact;
}
