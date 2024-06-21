import express from "express";
import { getCoordenadorias, addCoordenadoria, deleteCoordenadoria, updateCoordenadoria } from "../controllers/coordenadoria.js";

const router = express.Router();

router.get("/", getCoordenadorias);

router.post("/", addCoordenadoria);

router.put("/:IdCoordenadoria", updateCoordenadoria)

router.delete("/:IdCoordenadoria", deleteCoordenadoria);

export default router;