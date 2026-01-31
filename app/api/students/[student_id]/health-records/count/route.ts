import { db } from "@/lib/sqlite";

type RouteParams = {
    params: Promise<{ student_id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
    const { student_id } = await params;
    console.log(request);
    // Get count of health records for the student
    if (db) {
        const stmt = db.prepare(
            "SELECT COUNT(*) as count FROM health_records WHERE student_id = ?",
        );
        try {
            const result = stmt.get(student_id) as { count: number };
            return Response.json({
                student_id: student_id,
                count: result.count,
            });
        } catch (error) {
            return Response.json(
                { message: "Error retrieving health record count", error },
                { status: 500 },
            );
        }
    }
    return Response.json({ count: 0 });
}
