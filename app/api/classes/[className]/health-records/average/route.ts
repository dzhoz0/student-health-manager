import { db } from "@/lib/sqlite";
import { components } from "@/lib/api/types";

type HealthRecord = components["schemas"]["HealthRecord"];

type RouteParams = {
    params: Promise<{ className: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
    const { className } = await params;
    if (db) {
        // Get the last health record for each student in the class
        let healthRecords: HealthRecord[] = [];
        const stmt = db.prepare(`
            SELECT hr.*
            FROM health_records hr
            JOIN students s ON hr.student_id = s.student_id
            WHERE s.class = ?
            AND hr.date = (
                SELECT MAX(date)
                FROM health_records
                WHERE student_id = hr.student_id
            )
        `);
        try {
            healthRecords = stmt.all(className) as HealthRecord[];
            if (healthRecords.length === 0) {
                return Response.json(
                    { message: "No health records found for this class" },
                    { status: 404 },
                );
            }

            // Calculate average height and weight
            const totalHeight = healthRecords.reduce(
                (sum, record) => sum + record.height,
                0,
            );
            const totalWeight = healthRecords.reduce(
                (sum, record) => sum + record.weight,
                0,
            );
            const averageHeight = totalHeight / healthRecords.length;
            const averageWeight = totalWeight / healthRecords.length;

            return Response.json({
                averageHeight,
                averageWeight,
                class: className,
            });
        } catch (error) {
            return Response.json(
                { message: "Error retrieving health records", error },
                { status: 500 },
            );
        }
    }
}
