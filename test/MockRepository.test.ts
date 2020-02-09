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

  const testC: Test = {
    testNumber: 5,
    testString: "five"
  };
  
  it("should add", async () => {
    await repo.add(testA);
    expect(testA).to.haveOwnProperty("_id");
  });

  it("should list by id", async () => {
    const query = db.query().byId(testA._id);
    const result = await repo.list(query);
    const expected = [];
    expected.push(testA);
    expect(result).to.deep.equal(expected);
  });

  it("should update", async () => {
    const testB = testA;
    testB.testNumber = 4;
    testB.testString = "four";
    const result = await repo.update(testB);
    expect(result).to.deep.equal(0);
  });

  it("should list all", async () => {
    const query = db.query().all();
    const expected = await repo.list(query);
    await repo.add(testC);
    const result = await repo.list(query); 
    expected.push(testC);
    expect(result).to.deep.equal(expected);
  });
});