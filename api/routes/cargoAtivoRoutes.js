import express from "express";
import { getCargosAtivos} from "../controllers/cargoativo.js";

const router = express.Router();

router.get("/", getCargosAtivos);

export default router;