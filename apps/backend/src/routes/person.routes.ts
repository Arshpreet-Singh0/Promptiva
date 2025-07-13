import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addPerson, deletePerson, getAllPersons, getPersonById, updatePerson } from "../controllers/person.controller";

const router : Router = express.Router();

router.route("/").post(isAuthenticated, addPerson);

router.route("/").get(isAuthenticated, getAllPersons);

router.route("/:id").get(isAuthenticated, getPersonById);

router.route("/:id").put(isAuthenticated, updatePerson);

router.route("/:id").delete(isAuthenticated, deletePerson);


export default router;