import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import auth from "../helpers/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, getAllContacts);

contactsRouter.get("/:id", auth, getOneContact);

contactsRouter.delete("/:id", auth, deleteContact);

contactsRouter.post("/", auth, createContact);

contactsRouter.put("/:id", auth, updateContact);

contactsRouter.patch("/:id/favorite", auth, updateStatusContact);

export default contactsRouter;
