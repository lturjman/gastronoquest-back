const request = require("supertest");
const app = require("../app");
const Restaurant = require("../models/restaurants");

//register
describe("POST /users/register", () => {
  // Enlever le mock après les tests
  afterEach(() => {
    jest.restoreAllMocks();
  });

  //Test sur une inscription réussie
  it("POST /users/register inscription réussie", async () => {
    // Mock du findOne qui ne retourne rien (car l'utilisateur n'existe pas)
    jest.spyOn(User, "findOne").mockResolvedValue(null);

    // Body inséré dans le requête du test
    const requestBody = {
      username: "MauriceDupont",
      email: "maurice.dupont@example.com",
      password: "mauriceLeBest58",
    };

    // Exécution de la route avec le body
    const res = await request(app).post("/users/register").send(requestBody);

    // Résultats attendus
    expect(res.statusCode).toBe(201);
    expect(res.body.result).toBe(true);
  });

  //Test avec un utilisateur déjà existant
  it("POST /users/register Utilisateur déjà existant", async () => {
    // Mock du findOne qui ne retourne un utilisateur
    jest.spyOn(User, "findOne").mockResolvedValue({
      _id: "67d0547de816ad8c1f7113ce",
      username: "MauriceDupont",
      email: "maurice.dupont@example.com",
      password: "dezdzeezefoppqsqspq",
      token: "szazazssaz$ee",
      createdAt: "22/12/2020 12:03:04",
      favorites: [],
      quests: [],
      quizResults: [],
      __v: 0,
    });

    // Body inséré dans le requête du test
    const requestBody = {
      username: "MauriceDupont",
      email: "maurice.dupont@example.com",
      password: "mauriceLeBest58",
    };

    // Exécution de la route avec le body
    const res = await request(app).post("/users/register").send(requestBody);

    // Résultats attendus
    expect(res.statusCode).toBe(400);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe("email already used");
  });

  //Test avec un champ manquant
  it("POST /users/register Champ manquant", async () => {
    // Mock du findOne qui ne retourne rien (car l'utilisateur n'existe pas)
    jest.spyOn(User, "findOne").mockResolvedValue(null);

    // Body inséré dans le requête du test
    const requestBody = {
      email: "maurice.dupont@example.com",
      password: "mauriceLeBest58",
    };

    // Exécution de la requête
    const res = await request(app).post("/users/register").send(requestBody);

    // Résultats attendus
    expect(res.statusCode).toBe(400);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe("fields missing: username");
  });
});
