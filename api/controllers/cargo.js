import { db } from "../db.js";

export const getCargos = (_, res) => {
    const q = "SELECT * FROM cargo ORDER BY nome ASC";
  
    db.query(q, (err, data) => {
      if (err) return res.json(err);
  
      return res.status(200).json(data);
    });
  };

  export const addCargo = async (req, res) => {
    console.log(req.body);
  
    const q =
      'INSERT INTO cargo(`Nome`, `Status`) VALUES(?, ?)';
  
    const values = [
      req.body.Nome,
      req.body.Status,
    ];
  
    try {
      // Executa a consulta
      await db.query(q, values);
      return res.status(201).json('Cargo criado com sucesso!');
    } catch (err) {
      console.error('Erro ao executar a consulta:', err);
      return res.status(500).json('Erro interno no servidor');
    }
  };

  
export const updateCargo = (req, res) => {
  console.log(req.body);
  const q = 
  "UPDATE cargo SET  `Nome` = ?,  `Status` = ? WHERE `IdCargo` = ?";

  const values = [
    req.body.Nome,
    req.body.Status, 
  ];
  
  db.query(q, [...values, req.params.IdCargo], (err) => {
    if(err) return res.json(err);

    return res.status(200).json("Cargo Atualizado com sucesso!");
  });
}

export const deleteCargo = (req, res) => {
  const q = 
  "DELETE FROM cargo WHERE `IdCargo` = ?";

  db.query(q, [req.params.IdCargo], (err) => {
    if(err) return res.json(err);

    return res.status(200).json("Cargo Deletado com sucesso!");
  });
}