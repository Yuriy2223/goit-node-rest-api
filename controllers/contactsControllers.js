import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts(
      req.user.id,
      parseInt(req.query.page || 1),
      parseInt(req.query.limit || 20),
      req.query.favorite
    );
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(
      req.params.id,
      req.user.id
    );
    if (!contact) {
      throw new HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactsService.removeContact(
      req.params.id,
      req.user.id
    );
    if (!contact) {
      throw new HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }
    const contact = await contactsService.addContact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      owner: req.user.id,
    });
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new HttpError(400, "Body must have at least one field");
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }
    const contact = await contactsService.updateContact(
      req.params.id,
      req.user.id,
      req.body
    );
    if (!contact) {
      throw new HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    if (
      Object.keys(req.body).length === 0 ||
      !req.body.hasOwnProperty("favorite")
    ) {
      throw new HttpError(400, "Body must have favorite field");
    }
    const contact = await contactsService.updateStatusContact(
      req.params.id,
      req.user.id,
      req.body
    );
    if (!contact) {
      throw new HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
