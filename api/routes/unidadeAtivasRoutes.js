import express from "express";
import { getUnidadesAtivas} from "../controllers/unidadeativa.js";

const router = express.Router();

router.get("/", getUnidadesAtivas);

export default router;