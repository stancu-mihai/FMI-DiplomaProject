import { DbObject, Repository, Query } from "../others/db";
import { Collection, MongoCallback, MongoClient, ObjectID } from "mongodb";
import { replaceRepoIdsWithMongoIds, replaceMongoIdsWithRepoIds } from "../others/IdConversion";

export class MongoDBRepository<T extends DbObject> implements Repository<T> {

    private tableName: string;
    private url: string;
    public constructor(className: string) {
        this.tableName = className;
        this.url = process.env.MONGODB_URI;
    }

    public add(obj: T): Promise<void> {
        return new Promise((fulfill: any, reject: any) => {
            MongoClient.connect(this.url, { useNewUrlParser: true }, (err1, client) => {
                if (err1) {
                    reject(err1);
                } else {
                    this.createCollection(client, (err2, res1) => {
                        if (err2) {
                            client.close();
                            reject(err2);
                        } else {
                            replaceRepoIdsWithMongoIds(obj);
                            client.db().collection(this.getTableName()).insertOne(obj, (err3, res2) => {
                                replaceMongoIdsWithRepoIds(obj);
                                client.close();
                                if (err3) {
                                    reject(err3);
                                } else {
                                    fulfill();
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    public remove(filter: Query): Promise<number> {
        return new Promise((fulfill, reject) => {
            MongoClient.connect(this.url, { useNewUrlParser: true }, (err1, client) => {
                if (err1) {
                    reject(err1);
                } else {
                    client.db().collection(this.getTableName()).deleteMany(filter.build(), (err2, result) => {
                        client.close();

                        if (err2) {
                            reject(err2);
                        } else {
                            fulfill(result.deletedCount);
                        }
                    });
                }
            });
        });
    }

    public list(filter: Query): Promise<T[]> {
        return new Promise((fulfill, reject) => {
            MongoClient.connect(this.url, { useNewUrlParser: true }, (err1, client) => {
                if (err1) {
                    reject(err1);
                } else {
                    client.db().collection(this.getTableName()).find(filter.build()).toArray((err2, result) => {
                        client.close();

                        if (err2) {
                            reject(err2);
                        } else {
                            result.forEach(obj => {
                                replaceMongoIdsWithRepoIds(obj);
                            });
                            fulfill(result);
                        }
                    });
                }
            });
        });
    }

    public update(obj: T): Promise<number> {
        return new Promise((fulfill, reject) => {
            MongoClient.connect(this.url, { useNewUrlParser: true }, (err1, client) => {
                if (err1) {
                    reject(err1);
                } else {
                    const query = { _id: new ObjectID(obj._id.value) };

                    replaceRepoIdsWithMongoIds(obj);
                    const update = {
                        $set: Object.assign({}, obj)
                    };
                    delete update.$set._id;
                    replaceMongoIdsWithRepoIds(obj);
                    client.db().collection(this.getTableName()).updateOne(query, update, (err2, ret) => {
                        client.close();
                        if (err2) {
                            reject(err2);
                        } else {
                            fulfill(ret.result.nModified);
                        }
                    });
                }
            });
        });
    }

    private getTableName(): string {
        return this.tableName;
    }
    private createCollection(client: MongoClient, callback: MongoCallback<Collection>): void {
        client.db().createCollection(this.getTableName(), (err, res) => {
            callback(err, res);
        });
    }
}