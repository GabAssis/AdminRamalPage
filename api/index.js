import express from "express";
import userRoutes from "./routes/users.js";
import coordenadoriaRoutes from "./routes/coordenadoriaRoutes.js";
import cargoRoutes from "./routes/cargoRoutes.js"
import unidadeRoutes from "./routes/unidadeRoutes.js"
import cors from "cors";
import coordenadoriaAtivasRoutes from "./routes/coordenadoriaAtivaRoutes.js";
import unidadeAtivasRoutes from "./routes//unidadeAtivasRoutes.js";
import cargoAtivoRoutes from "./routes//cargoAtivoRoutes.js";



const app = express()

app.use(express.json())
app.use(cors())

app.use("/", userRoutes);
app.use("/coordenadorias", coordenadoriaRoutes);
app.use("/coordenadoriasativas", coordenadoriaAtivasRoutes);
app.use("/unidadesativas", unidadeAtivasRoutes);
app.use("/cargossativos", cargoAtivoRoutes);
app.use("/cargos", cargoRoutes);
app.use("/unidades", unidadeRoutes);
app.listen(8801, '0.0.0.0')

