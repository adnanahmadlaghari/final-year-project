import { Router } from "express";
import { verifyToken } from "../middleware/authMmiddleware.js";
import {
  getAllContacts,
  getContactForDMList,
  SearchContacts,
} from "../controllers/contactController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, SearchContacts);
contactsRoutes.get("/get-contacts-dm-list", verifyToken, getContactForDMList);
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts);

export default contactsRoutes;
