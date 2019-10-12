import { DbObjectId } from "./db";
import { ObjectID } from "mongodb";

export const replaceMongoIdsWithRepoIds = (dict: any) => {
    if (!dict ||
        typeof (dict) === "string" || dict instanceof String ||
        typeof (dict) === "number" || dict instanceof Number ||
        typeof (dict) === "boolean" || dict instanceof Boolean)
        return;

    for (const key in dict) {
        if (dict.hasOwnProperty(key)) {
            const val = dict[key];
            if (val instanceof ObjectID) {
                dict[key] = new DbObjectId((val as ObjectID).toHexString());
            } else {
                replaceMongoIdsWithRepoIds(val);
            }
        }
    }
};
export const replaceRepoIdsWithMongoIds = (dict: any) => {
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
            } else {
                replaceRepoIdsWithMongoIds(val);
            }
        }
    }
};