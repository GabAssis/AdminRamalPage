import { db } from "../db.js";

export const getCargosAtivos = (_, res) => {
    const q = "SELECT * FROM cargo WHERE Status = 1";
  
    db.query(q, (err, data) => {
      if (err) return res.json(err);
  
      return res.status(200).json(data);
    });
  };
  