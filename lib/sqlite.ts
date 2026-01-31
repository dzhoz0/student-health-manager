import Database from "better-sqlite3";
import { initDb } from "@/db/init";
import path from "path";

let db: Database.Database | undefined;

const dbPath =
    process.env.DATABASE_URL ??
    path.join(process.cwd(), "app.db");

if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    initDb();
}

export { db };
