import express from "express";
import {
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    
} from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);

router.post("/", addUser);

router.put("/:IdRamal", updateUser);

router.delete("/:IdRamal", deleteUser);


  


export default router