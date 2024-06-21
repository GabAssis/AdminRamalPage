import { db } from "../db.js";

export const getUnidades = (_, res) => {
    const q = `
        SELECT 
            u.IdUnidade,
            u.Nome,
            u.EH,
            u.IdCoordenadoria,
            c.Nome AS NomeCoordenadoria,
            u.Sigla,
            u.Status
        FROM Unidade u
        JOIN Coordenadoria c ON u.IdCoordenadoria = c.IdCoordenadoria
        ORDER BY u.Nome;
    `;
  
    db.query(q, (err, data) => {
        if (err) return res.json(err);
  
        return res.status(200).json(data);
    });
};


export const addUnidade= async (req, res) => {
  console.log(req.body);

  const q =
    'INSERT INTO unidade(`Nome`,`EH`, `IdCoordenadoria`,`Sigla`, `Status`) VALUES(?, ?, ?, ?, ?)';

  const values = [
    req.body.Nome,
    req.body.EH,
    req.body.IdCoordenadoria,
    req.body.Sigla,
    req.body.Status,
  ];

  try {
    await db.query(q, values);
    return res.status(201).json('Unidade criado com sucesso!');
  } catch (err) {
    console.error('Erro ao executar a consulta:', err);
    return res.status(500).json('Erro interno no servidor');
  }
};

export const updateUnidade = (req, res) => {
  console.log(req.body);
  const q = 
  "UPDATE unidade SET  `Nome` = ?, `EH` = ?, `IdCoordenadoria` = ?,`Sigla` = ?,  `Status` = ? WHERE `IdUnidade` = ?";

  const values = [
    req.body.Nome,
    req.body.EH,
    req.body.IdCoordenadoria,
    req.body.Sigla,
    req.body.Status,
  ];
  
  db.query(q, [...values, req.params.IdUnidade], (err) => {
    if(err) return res.json(err);

    return res.status(200).json("Unidade Atualizada com sucesso!");
  });
}

export const deleteUnidade = (req, res) => {
  const q = 
  "DELETE FROM unidade WHERE `IdUnidade` = ?";

  db.query(q, [req.params.IdUnidade], (err) => {
    if(err) return res.json(err);

    return res.status(200).json("Unidade Deletada com sucesso!");
  });
}
