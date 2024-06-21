import { db } from "../db.js";

export const getUsers = (_, res) => {
  const q = `
  SELECT r.*, 
  c.Nome AS NomeCoordenadoria, 
  u.Nome AS NomeUnidade, 
  cg.Nome AS NomeCargo
FROM Ramal r 
JOIN Coordenadoria c ON r.IdCoordenadoria = c.IdCoordenadoria
JOIN Unidade u ON r.IdUnidade = u.IdUnidade
JOIN Cargo cg ON r.IdCargo = cg.IdCargo 
ORDER BY r.Nome DESC; `;

  db.query(q, (err, data) => {
    if(err) return res.json(err);

    return res.status(200).json(data);
  });  
};

export const addUser = async (req, res) => {
  console.log(req.body);

  const q =
    'INSERT INTO ramal(`Nome`, `IdCoordenadoria`, `IdUnidade`, `IdCargo`, `Numero`, `Status`) VALUES(?, ?, ?, ?, ?, ?)';

  const values = [
    req.body.Nome,
    req.body.IdCoordenadoria,
    req.body.IdUnidade,
    req.body.IdCargo,
    req.body.Numero,
    req.body.Status,
  ];

  try {
    // Executa a consulta
    await db.query(q, values);
    return res.status(201).json('Ramal criado com sucesso!');
  } catch (err) {
    console.error('Erro ao executar a consulta:', err);
    return res.status(500).json('Erro interno no servidor');
  }
};

export const updateUser = (req, res) => {
  console.log(req.body);
  const q = 
  "UPDATE ramal SET  `Nome` = ?, `IdCoordenadoria` = ?, `IdUnidade`  = ?, `IdCargo` = ?, `Numero` = ?, `Status` = ? WHERE `IdRamal` = ?";

  const values = [
    req.body.Nome,
    req.body.IdCoordenadoria,
    req.body.IdUnidade,
    req.body.IdCargo,
    req.body.Numero,
    req.body.Status, 
  ];
  
  db.query(q, [...values, req.params.IdRamal], (err) => {
    if(err) return res.json(err);

    return res.status(200).json("Ramal Atualizado com sucesso!");
  });
}

export const deleteUser = (req, res) => {
  const q = 
  "DELETE FROM ramal WHERE `IdRamal` = ?";

  db.query(q, [req.params.IdRamal], (err) => {
    if(err) return res.json(err);

    return res.status(200).json("Ramal Deletado com sucesso!");
  });
};


