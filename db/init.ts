import fs from "fs";
import path from "path";
import { db } from "@/lib/sqlite";

let initialized = false;

export function initDb() {
    if (initialized) return;

    const schemaPath = path.join(process.cwd(), "db/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    if (db) db.exec(schema);
    initialized = true;
}
