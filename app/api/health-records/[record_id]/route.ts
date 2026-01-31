import { db } from "@/lib/sqlite";

type RouteParams = {
    params: Promise<{ record_id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
    const { record_id } = await params;

    if (db) {
        const stmt = db.prepare(
            "SELECT * FROM health_records WHERE record_id = ?",
        );
        try {
            const healthRecord = stmt.get(record_id);
            if (healthRecord) {
                return Response.json(healthRecord);
            }
            return Response.json(
                { message: "Health record not found" },
                { status: 404 },
            );
        } catch (error) {
            return Response.json(
                { message: "Error retrieving health record", error },
                { status: 500 },
            );
        }
    }
}
