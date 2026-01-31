import { db } from "@/lib/sqlite";
import { components } from "@/lib/api/types";

type HealthRecord = components["schemas"]["HealthRecord"];

export function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "";
    if (type === "") {
        return Response.json(
            { message: "Type parameter is required" },
            { status: 400 },
        );
    }
    let outlierRecords: HealthRecord[] = [];
    if (db) {
        let query = "";
        if (type === "height") {
            query =
                "SELECT * FROM health_records WHERE height < 100 OR height > 200";
        } else if (type === "weight") {
            query =
                "SELECT * FROM health_records WHERE weight < 30 OR weight > 150";
        } else if (type == "bmi") {
            query = `SELECT *, (weight / ((height / 100) * (height / 100))) AS bmi
                     FROM health_records WHERE bmi < 18 OR bmi > 24`;
        } else {
            return Response.json(
                { message: "Invalid type parameter" },
                { status: 400 },
            );
        }
        const stmt = db.prepare(query);
        try {
            outlierRecords = stmt.all() as HealthRecord[];
            return Response.json(outlierRecords);
        } catch (error) {
            return Response.json(
                { message: "Error retrieving outlier records", error },
                { status: 500 },
            );
        }
    }
    return Response.json(outlierRecords);
}
