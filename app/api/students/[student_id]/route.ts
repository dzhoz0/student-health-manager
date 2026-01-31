import { db } from "@/lib/sqlite";
import { components } from "@/lib/api/types";

type Student = components["schemas"]["Student"];
type RouteParams = {
    params: Promise<{ student_id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
    const { student_id } = await params;

    if (db) {
        const stmt = db.prepare("SELECT * FROM students WHERE student_id = ?");
        try {
            const student = stmt.get(student_id) as Student | undefined;
            if (student) {
                return Response.json(student);
            }
            return Response.json(
                { message: "Student not found" },
                { status: 404 },
            );
        } catch (error) {
            return Response.json(
                { message: "Error retrieving student", error },
                { status: 500 },
            );
        }
    }
    return Response.json({ message: "Student not found" }, { status: 404 });
}
