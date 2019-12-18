import { DbObjectId, Query, QueryBuilder } from "../others/db";
// TODO: Remove this!
import { ObjectID, Db } from "mongodb";

export class MockQueryBuilder implements QueryBuilder {
  all(): Query {
    return {
      build: (): any => {
          return null;
      }
    };
  }
  byId(id: string | DbObjectId): Query {
    return {
      build: (): any => {
        let val: string;
        const filter: any = {};
        if (id instanceof DbObjectId) {
            val = id.value;
        } else {
            val = id;
        }
        filter["_id"] = new DbObjectId(val);

        return filter;
      }
    };
  }
  byProperty(propName: string, propVal: string | number | boolean | Date | DbObjectId): Query {
    return {
        build: (): any => {
          const filter: any = {};
          if (propVal instanceof DbObjectId)
              filter[propName] = new ObjectID(propVal.value);
          else
              filter[propName] = propVal;

          return filter;
        }
    };
  }
  byProperties(dict: any): Query {
    return {
      build: (): any => {
        this.updateIdsToMongo(dict);
        return dict;
      }
    };
  }

  private updateIdsToMongo(dict: any) {
    if (!dict ||
      typeof (dict) === "string" || dict instanceof String ||
      typeof (dict) === "number" || dict instanceof Number ||
      typeof (dict) === "boolean" || dict instanceof Boolean)
      return;

    for (const key in dict) {
      if (dict.hasOwnProperty(key)) {
        const val = dict[key];
        if (val instanceof DbObjectId) {
            dict[key] = new ObjectID(val.value);
        }
        this.updateIdsToMongo(val);
      }
    }
  }
}