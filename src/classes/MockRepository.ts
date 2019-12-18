import { DbObject, Query, Repository } from "../others/db";
import { DbObjectId } from "../others/db";
import { ObjectID } from "mongodb";

export class MockRepository<T extends DbObject> implements Repository<T> {
  private data: T[];
  
  public constructor(className: string) {
    //TODO: implement table (className)
    this.data = [];
  }

  private includedIn(small: any, big: any) {
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
        // Removes objects that match the query
        this.data = this.data.filter((obj: any) => !this.includedIn(query.build(), obj));
        fulfill(this.data);
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
        const query = { _id: new ObjectID(object._id.value) };
        fulfill(this.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}