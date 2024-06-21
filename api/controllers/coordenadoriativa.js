import { db } from "../db.js";

export const getCoordenadoriasAtivas = (_, res) => {
    const q = "SELECT * FROM coordenadoria WHERE Status = 1";
  
    db.query(q, (err, data) => {
      if (err) return res.json(err);
  
      return res.status(200).json(data);
    });
  };
  