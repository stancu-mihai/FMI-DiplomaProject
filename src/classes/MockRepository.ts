import { DbObject, Query, Repository } from "../others/db";
import { DbObjectId } from "../others/db";
import { ObjectID } from "mongodb";
import * as db from "../others/db";

export class MockRepository<T extends DbObject> implements Repository<T> {
  private data: T[];
  
  public constructor(className: string) {
    //TODO: implement table (className)
    this.data = [];
  }

  private includedIn(small: any, big: any) {
    if(!small) // query.all() means small is undefined
      return true;

    const smallProps = Object.getOwnPropertyNames(small);

    for (let i = 0; i < smallProps.length; i++) {
      const propValue: string = smallProps[i];
      if (  (big[propValue]) &&
            JSON.stringify(big["_id"])!==JSON.stringify(small["_id"]) ) {
        return false;
      }
    }
    return true;
  }

  public add(object: T): Promise<void> {
    return new Promise((fulfill: any, reject: any) => {
      try {
        const newGuid = new ObjectID();
        object._id = new DbObjectId(newGuid.toString());
        this.data.push(object);
        fulfill();
      } catch (error) {
        reject(error);
      }
    });
  }
  public remove(query: Query): Promise<number> {
    return new Promise((fulfill: any, reject: any) => {
      try {
        // Remove objects that match the query
        this.data.forEach((obj: T) => {
          if(this.includedIn(query.build(), obj))
            this.data.splice(this.data.indexOf(obj), 1);
        });
        fulfill();
      } catch (error) {
        reject(error);
      }
    });
  }

  public list(query: Query): Promise<T[]> {
    return new Promise((fulfill: any, reject: any) => {
      try {
        // Return objects that match the query
        const resArray: T[] = [];
        this.data.forEach((obj: T) => {
          if(this.includedIn(query.build(), obj))
            resArray.push(obj);
        });
        fulfill(resArray);
      } catch (error) {
        reject(error);
      }
    });
  }
  public update(object: T): Promise<number> {
    return new Promise((fulfill: any, reject: any) => {
      try {
        // Save the object, delete it by id then restore it
        const tempObj = object;
        const query = db.query().byId(object._id);
        this.remove(query);
        this.add(tempObj);
        fulfill(0);
      } catch (error) {
        reject(error);
      }
    });
  }
}