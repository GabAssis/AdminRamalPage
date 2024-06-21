import express from "express";
import { getCargos, addCargo, updateCargo, deleteCargo } from "../controllers/cargo.js";

const router = express.Router();

router.get("/", getCargos);

router.post("/", addCargo);

router.put("/:IdCargo", updateCargo)

router.delete("/:IdCargo", deleteCargo);

export default router;