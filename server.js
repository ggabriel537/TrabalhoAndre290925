const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, "db.json");

app.use(express.json());
app.use(express.static("public"));

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.get("/api/alunos", (req, res) => {
  const alunos = readDB();
  res.json(alunos);
});

app.post("/api/alunos", (req, res) => {
  const { rgm, nome, idade } = req.body;
  if (!rgm || !nome || !idade) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  if (!/^\d{3}\.\d{3}$/.test(rgm)) {
    return res.status(400).json({ error: "RGM deve estar no formato xxx.xxx" });
  }

  let alunos = readDB();
  if (alunos.some(a => a.rgm === rgm)) {
    return res.status(400).json({ error: "RGM já cadastrado" });
  }

  const aluno = { rgm, nome, idade };
  alunos.push(aluno);
  writeDB(alunos);

  res.status(201).json(aluno);
});

if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  }
  
  module.exports = app;
  
