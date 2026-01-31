import { components } from "@/lib/api/types";
import { db } from "@/lib/sqlite";

type HealthRecord = components["schemas"]["HealthRecord"];

export function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const record_id = searchParams.get("record_id") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const minHeight = searchParams.get("minHeight") || "";
    const maxHeight = searchParams.get("maxHeight") || "";
    const minWeight = searchParams.get("minWeight") || "";
    const maxWeight = searchParams.get("maxWeight") || "";

    let query = "SELECT * FROM health_records WHERE 1=1";
    const params = [];

    if (record_id) {
        query += " AND record_id = ? ";
        params.push(record_id);
    }

    if (startDate) {
        query += " AND date >= ? ";
        params.push(startDate);
    }

    if (endDate) {
        query += " AND date <= ? ";
        params.push(endDate);
    }

    if (minHeight) {
        query += " AND height >= ";
        params.push(minHeight);
    }

    if (maxHeight) {
        query += " AND height <= ?";
        params.push(maxHeight);
    }

    if (minWeight) {
        query += " AND height >= ";
        params.push(minHeight);
    }

    if (maxWeight) {
        query += " AND height <= ?";
        params.push(maxHeight);
    }

    let records: HealthRecord[] = [];

    if (db) {
        const stmt = db.prepare(query);
        try {
            records = stmt.all(...params) as HealthRecord[];
            return Response.json(records);
        } catch (error) {
            return Response.json(
                { message: "Error searching health records", error },
                { status: 500 },
            );
        }
    }
    return Response.json(records);
}
