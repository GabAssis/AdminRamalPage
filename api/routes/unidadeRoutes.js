import express from "express";
import { getUnidades, addUnidade, updateUnidade, deleteUnidade } from "../controllers/unidade.js";

const router = express.Router();

router.get("/", getUnidades);

router.post("/", addUnidade);

router.put("/:IdUnidade", updateUnidade)

router.delete("/:IdUnidade", deleteUnidade);

export default router;