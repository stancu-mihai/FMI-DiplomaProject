import { DbObject, QueryBuilder, Repository } from "./db";
import { ModuleFactory } from "../interfaces/ModuleFactory";
import { MockQueryBuilder } from "../classes/MockQueryBuilder";
import { MockRepository } from "../classes/MockRepository";

export class MockDbModuleFactory implements ModuleFactory {

    public createRepository<T extends DbObject>(opts: any): Repository<T> {
        return new MockRepository<T>(opts.table);
    }
    public createQueryBuilder(opts: any): QueryBuilder {
        return new MockQueryBuilder();
    }
}

export const init = () => new MockDbModuleFactory();