import mongoose from "mongoose";
import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

export async function listContacts(owner, page = 1, limit = 20, favorite) {
  const skip = (page - 1) * limit;
  const filter = { owner };
  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
  }
  return await Contact.find(filter).skip(skip).limit(limit);
}

export async function getContactById(contactId, owner) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new HttpError(400, "Invalid ID");
  }
  return await Contact.findById({ _id: contactId, owner });
}

export async function removeContact(contactId, owner) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new HttpError(400, "Invalid ID");
  }
  const result = await Contact.deleteOne({
    _id: contactId,
    owner,
  });
  if (result.deletedCount === 0) {
    throw new HttpError(404, "Contact not found");
  }
  return { message: "Contact removed" };
}

export async function addContact({
  name,
  email,
  phone,
  favorite = false,
  owner,
}) {
  return await Contact.create({
    name,
    email,
    phone,
    favorite,
    owner,
  });
}

export async function updateContact(contactId, owner, body) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, "Invalid ID");
  }
  const contact = await Contact.findByIdAndUpdate(
    { _id: contactId, owner },
    body,
    {
      new: true,
    }
  );
  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }
  return contact;
}

export async function updateStatusContact(contactId, owner, body) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new HttpError(400, "Invalid ID");
  }
  const contact = await Contact.findByIdAndUpdate(
    { _id: contactId, owner },
    { favorite: body.favorite },
    { new: true }
  );
  if (!contact) {
    throw new HttpError(404, "Contact not found");
  }
  return contact;
}
