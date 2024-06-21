import { db } from "../db.js";

export const getCoordenadorias = (_, res) => {
    const q = "SELECT * FROM coordenadoria ORDER BY nome ASC";
  
    db.query(q, (err, data) => {
      if (err) return res.json(err);
  
      return res.status(200).json(data);
    });
  };
  

  export const addCoordenadoria = async (req, res) => {
    console.log(req.body);
  
    const q =
      'INSERT INTO coordenadoria(`Nome`, `Status`) VALUES(?, ?)';
  
    const values = [
      req.body.Nome,
      req.body.Status,
    ];
  
    try {
      // Executa a consulta
      await db.query(q, values);
      return res.status(201).json('Coordenadoria criado com sucesso!');
    } catch (err) {
      console.error('Erro ao executar a consulta:', err);
      return res.status(500).json('Erro interno no servidor');
    }
  };

  
export const updateCoordenadoria = (req, res) => {
  console.log(req.body);
  const q = 
  "UPDATE coordenadoria SET  `Nome` = ?,  `Status` = ? WHERE `IdCoordenadoria` = ?";

  const values = [
    req.body.Nome,
    req.body.Status, 
  ];
  
  db.query(q, [...values, req.params.IdCoordenadoria], (err) => {
    if(err) return res.json(err);

    return res.status(200).json("Coordenadoria Atualizada com sucesso!");
  });
}

export const deleteCoordenadoria = (req, res) => {
  const q = 
  "DELETE FROM coordenadoria WHERE `IdCoordenadoria` = ?";

  db.query(q, [req.params.IdCoordenadoria], (err) => {
    if(err) return res.json(err);

    return res.status(200).json("Coordenadoria Deletada com sucesso!");
  });
}
