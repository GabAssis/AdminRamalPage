import { db } from "../db.js";

export const getUnidadesAtivas = (_, res) => {
    const q = "SELECT * FROM unidade WHERE Status = 1";
  
    db.query(q, (err, data) => {
      if (err) return res.json(err);
  
      return res.status(200).json(data);
    });
  };
  