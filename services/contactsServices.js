import mongoose from "mongoose";
import Contact from "../models/contact.js";

export async function listContacts() {
  return await Contact.find();
}

export async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

export async function removeContact(contactId) {
  return await Contact.findByIdAndRemove(contactId);
}

export async function addContact({ name, email, phone, favorite = false }) {
  return await Contact.create({ name, email, phone, favorite });
}

export async function updateContact(id, body) {
  return await Contact.findByIdAndUpdate(id, body, { new: true });
}

export async function updateStatusContact(id, body) {
  return await Contact.findByIdAndUpdate(
    id,
    { favorite: body.favorite },
    { new: true }
  );
}
