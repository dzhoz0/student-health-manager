import { db } from "@/lib/sqlite";
export function GET() {
    if (db) {
        console.log(db.prepare("SELECT 1").get());
    }
    return new Response("API is working");
}
