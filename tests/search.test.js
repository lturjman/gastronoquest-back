const request = require("supertest");
const app = require("../app");


it("POST /search/restaurant 'Entre nous'", async () => {

  // Body inséré dans le requête du test
  const requestBody = {
    input: "entre nous"
  };

  // Exécution de la route avec le body
  const res = await request(app).post("/search/restaurant").send(requestBody);

  // Résultats attendus
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.restaurants).toHaveLength(1);
  expect(res.body.restaurants[0].name).toBe("Entre nous");
});


it("POST /search/address 'Tours'", async () => {

  // Body inséré dans le requête du test
  const requestBody = {
    input: "Tours",
    distance: "Lieu exact"
  };

  // Exécution de la route avec le body
  const res = await request(app).post("/search/address").send(requestBody);

  // Résultats attendus
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.restaurants).toHaveLength(2);
});