import { db } from "@/lib/sqlite";
import { components } from "@/lib/api/types";

type Student = components["schemas"]["Student"];

export function GET() {
    // Get all students from the database
    let students: Student[] = [];
    if (db) {
        const stmt = db.prepare("SELECT * FROM students");
        students = stmt.all() as Student[];
        return Response.json(students);
    }
}

export function POST(request: Request) {
    let student: Student;
    return request.json().then((body) => {
        student = body;
        if (db) {
            // studentId, name, class, dob
            const stmt = db.prepare(
                "INSERT INTO students (student_id, name, class, dob) VALUES (?, ?, ?, ?)",
            );

            // If error occurs, an exception will be thrown
            try {
                stmt.run(
                    student.student_id,
                    student.name,
                    student.class,
                    student.dob,
                );
            } catch (e) {
                return Response.json(
                    { message: "Error inserting student", error: e },
                    { status: 500 },
                );
            }
        }
        return Response.json({ message: "Student received", student });
    });
}
