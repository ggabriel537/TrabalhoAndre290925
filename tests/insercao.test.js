const request = require("supertest");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../db.json");
let app;

beforeAll(() => {
  app = require("../server"); // importa o servidor
});

beforeEach(() => {
  fs.writeFileSync(DB_PATH, JSON.stringify([])); // limpa o banco antes de cada teste
});

describe("Teste de cadastro de alunos", () => {
  it("deve inserir um aluno válido", async () => {
    const aluno = { rgm: "123.456", nome: "Gabriel", idade: 22 };

    const res = await request(app).post("/api/alunos").send(aluno);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("rgm", "123.456");
    expect(res.body).toHaveProperty("nome", "Gabriel");
    expect(res.body).toHaveProperty("idade", 22);

    const data = JSON.parse(fs.readFileSync(DB_PATH));
    expect(data.length).toBe(1);
    expect(data[0].rgm).toBe("123.456");
  });

  it("não deve permitir RGM duplicado", async () => {
    const aluno = { rgm: "111.111", nome: "João", idade: 20 };

    await request(app).post("/api/alunos").send(aluno);
    const res = await request(app).post("/api/alunos").send(aluno);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("RGM já cadastrado");
  });

  it("não deve aceitar RGM em formato inválido", async () => {
    const aluno = { rgm: "123456", nome: "Maria", idade: 19 };

    const res = await request(app).post("/api/alunos").send(aluno);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("RGM deve estar no formato xxx.xxx");
  });
});
