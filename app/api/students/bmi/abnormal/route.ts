import { db } from "@/lib/sqlite";
import { components } from "@/lib/api/types";
type Student = components["schemas"]["Student"];

export function GET() {
    // Get students with BMI < 18 or > 25
    let students: Student[] = [];
    if (db) {
        const stmt = db.prepare(`
            SELECT s.*
            FROM students s
            JOIN health_records h ON s.student_id = h.student_id
            WHERE (h.weight / ((h.height / 100) * (h.height / 100)) < 18)
                OR (h.weight / ((h.height / 100) * (h.height / 100)) > 25)
        `);
        try {
            students = stmt.all() as Student[];
        } catch (error) {
            return Response.json(
                {
                    message: "Error retrieving students with abnormal BMI",
                    error,
                },
                { status: 500 },
            );
        }
    }
    // Only return student ids
    const students_ids = students.map((student) => student.student_id);
    return Response.json(students_ids);
}
