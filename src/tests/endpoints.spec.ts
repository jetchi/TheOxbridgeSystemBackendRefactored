import { endpoints } from "../2_entities/endpoints";
import request from "supertest";

const api = endpoints;

// AAA-testing with the "supertest framework", get a single ship by its id
// ARRANGE = if needed, first setup the mocks or create objects.
describe("Ships, to GET with /shipId", () => {
    it("GET should get a single ship by its shipId", async () => {
        // ACT = the invocation of the method being tested
        const result = await request(api).get("/ships/3");
        // ASSERT = examine if the expectations were met
        expect(result.body).toEqual({"_id": "60b389a656eb210aa9a9029c", "name":"Bellis","shipId":3,"emailUsername":"heidi@web.de", "teamName":"Cutty Sark Team"});
        expect(result.status).toEqual(200);
    });
  });
