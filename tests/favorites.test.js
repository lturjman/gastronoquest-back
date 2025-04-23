const request = require("supertest");
const app = require("../app");

const User = require("../models/users");
const Restaurant = require("../models/restaurants");

const userMock = {
  _id: "67d0547de816ad8c1f7113ce",
  username: "ClaudeDupont",
  email: "claude.dupont@example.com",
  password: "passworddeclaude",
  token: "tokentest*dh",
  createdAt: "22/12/2020 12:03:04",
  favorites: [],
  quests: [],
  quizResults: [],
  __v: 0,
};

describe("POST/favoites", () => {
  it("ajouter un restaurant aux favoris", async () => {
    jest.spyOn(User, "findOne").mockResolvedValue(userMock);

    // mock de restaurant
    jest.spyOn(Restaurant, "findById").mockResolvedValue({
      id: "Restaurant123",
      name: "Sub-Ex",
      desc: "Ramen Noodle Soup Cups",
      longDesc: "Pumpkin Waffles",
      score: 1,
      badges: "Argos Therapeutics, Inc.",
      types: "Canada Goose Holdings Inc.",
      address: "rue du restaurant",
      coordinates: "238.120.89.142",
      imageUrl:
        "http://apache.org/consectetuer/adipiscing/elit/proin/interdum/mauris.p…",
      websiteUrl:
        "https://artisteer.com/lectus/in/quam/fringilla/rhoncus.html?mi=orci&pe…",
      bookingUrl:
        "http://paginegialle.it/justo/in/hac.jpg?ultrices=et&vel=magnis&augue=d…",
    });

    jest.spyOn(User, "updateOne").mockResolvedValue({ acknowledged: true });

    // Body inséré dans le requête du test
    const requestBody = {
      restaurantId: "Restaurant123",
    };

    // Exécution de la route avec le body
    const res = await request(app)
      .post("/favorites")
      .send(requestBody)
      .set("authorization", "tokentest");

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
  });

  it("si pas de restaurant", async () => {
    const res = await request(app).post("/favorites");

    expect(res.statusCode).toBe(400);
    expect(res.body.result).toBe(false);
  });

  it("si pas de user", async () => {
    const res = await request(app).post("/favorites");

    expect(res.statusCode).toBe(400);
    expect(res.body.result).toBe(false);
  });
});
