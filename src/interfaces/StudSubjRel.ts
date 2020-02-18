import { DbObject, DbObjectId } from "../others/db";

export interface StudSubjRel extends DbObject {
    studentGroupId: DbObjectId;
    subjectId: DbObjectId;
    semester: number;
}