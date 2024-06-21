import express from "express";
import { getCoordenadoriasAtivas} from "../controllers/coordenadoriativa.js";

const router = express.Router();

router.get("/", getCoordenadoriasAtivas);

export default router;