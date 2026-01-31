import Database from "better-sqlite3";
import { initDb } from "@/db/init";

let db: Database.Database | undefined;

if (!db) {
    db = new Database("app.db");
    db.pragma("journal_mode = WAL");
    initDb();
}

export { db };
