import { db } from "@/lib/sqlite";
import { components } from "@/lib/api/types";

type HealthRecord = components["schemas"]["HealthRecord"];

export function GET() {
    // Get all health records from the database
    let healthRecords: HealthRecord[] = [];
    if (db) {
        const stmt = db.prepare("SELECT * FROM health_records");
        healthRecords = stmt.all() as HealthRecord[];
        return Response.json(healthRecords);
    }
    return Response.json(healthRecords);
}

export async function POST(request: Request) {
    // id, student_id, date, height, weight, notes
    const healthRecord: HealthRecord = await request.json();
    if (db) {
        // Insert health record into the database
        const stmt = db.prepare(
            "INSERT INTO health_records (student_id, date, height, weight, notes) VALUES (?, ?, ?, ?, ?)",
        );
        // If error occurs, an exception will be thrown
        try {
            stmt.run(
                healthRecord.student_id,
                healthRecord.date,
                healthRecord.height,
                healthRecord.weight,
                healthRecord.notes,
            );
        } catch (e) {
            return Response.json(
                { message: "Error inserting health record", error: e },
                { status: 500 },
            );
        }
    }
    return Response.json({ message: "Health record received" });
}
