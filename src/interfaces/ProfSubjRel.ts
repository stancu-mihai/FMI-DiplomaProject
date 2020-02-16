import { DbObject, DbObjectId } from "../others/db";

export interface ProfSubjRel extends DbObject {
    professorId: DbObjectId;
    subjectId: DbObjectId;
}