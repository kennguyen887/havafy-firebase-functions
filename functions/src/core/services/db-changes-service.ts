import {firestore} from "firebase-admin";
import {DbChangedRecord} from "../data/db-changed-record";
import {
    DbChangedRecordFirestoreModel
} from "../data/models/db-changed-record/firestore/db-changed-record-firestore-model";

import * as admin from "firebase-admin";

import Timestamp = firestore.Timestamp;

class DbChangesService {
    private get collectionRef () { return admin.firestore().collection("db-changes"); }

    async addRecord (record: DbChangedRecord) : Promise<void> {
        const ref = this.collectionRef.doc();
        const documentData = DbChangedRecordFirestoreModel
            .fromEntity(record.copyWith({ recordId: ref.id }))
            .toDocumentData(new Date());
        await ref.set(documentData);
    }

    async getRecords(): Promise<Array<DbChangedRecord>> {
        return (await this.collectionRef
            .orderBy(DbChangedRecordFirestoreModel.kDateTime, "desc")
            .get()
        ).docs.map((doc) => DbChangedRecordFirestoreModel.fromDocumentData(doc.data()))
    }
}


export const dbChangesService: DbChangesService = new DbChangesService();
