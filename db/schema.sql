PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    dob DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS health_records (
    record_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    date DATE NOT NULL,
    height INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    notes TEXT,

    FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE CASCADE
);
