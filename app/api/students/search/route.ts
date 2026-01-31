import { db } from "@/lib/sqlite";
import { components } from "@/lib/api/types";
type Student = components["schemas"]["Student"];

export function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const student_id = searchParams.get("student_id") || "";
    const name = searchParams.get("name") || "";
    const className = searchParams.get("class") || "";
    const dob = searchParams.get("dob") || "";

    let query = "SELECT * FROM students WHERE 1=1";
    const params = [];

    if (student_id) {
        query += " AND student_id = ?";
        params.push(student_id);
    }
    if (name) {
        query += " AND name LIKE ?";
        params.push(`%${name}%`);
    }
    if (className) {
        query += " AND class = ?";
        params.push(className);
    }
    if (dob) {
        query += " AND dob = ?";
        params.push(dob);
    }

    let students: Student[] = [];
    if (db) {
        const stmt = db.prepare(query);
        try {
            students = stmt.all(...params) as Student[];
            return Response.json(students);
        } catch (error) {
            return Response.json(
                { message: "Error searching students", error },
                { status: 500 },
            );
        }
    }
    return Response.json(students);
}
