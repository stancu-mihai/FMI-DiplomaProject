import { expect } from "chai";

import { MockRepository } from "../src/classes/MockRepository";
import * as db from "../src/others/db";
import * as mockDbRepo from "../src/others/mockdb";

interface Test extends db.DbObject {
  testNumber: number;
  testString: string;
}

describe("Mock Repo tests", () => {
  const repo = new MockRepository<Test>("nothing");
  db.use(mockDbRepo.init());
  const testA: Test = {
    testNumber: 3,
    testString: "three"
  };
  
  it("should add", async () => {
    await repo.add(testA);
    expect(testA).to.haveOwnProperty("_id");
  });

  it("should list", async () => {
    const query = db.query().byId(testA._id);
    const result = await repo.list(query);
    const expected = [];
    expected.push(testA);
    expect(result).to.deep.equal(expected);
  });
});