"use client";

import React, { useState } from "react";
import { Card, Label, TextInput, Button, Alert } from "flowbite-react";
import { components } from "@/lib/api/types";
import api from "@/lib/api/client";

type Student = components["schemas"]["Student"];

interface StudentAddFormProps {
    onSubmit?: (data: Student) => void;
}

const StudentAddForm: React.FC<StudentAddFormProps> = ({ onSubmit }) => {
    const [form, setForm] = useState<Student>({
        student_id: 0,
        name: "",
        class: "",
        dob: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "student_id" ? Number(value) : value,
        }));
    };

    const submitForm = async () => {
        setError(null);
        setSuccess(false);

        // 🔒 basic validation
        if (!form.student_id || !form.name || !form.class || !form.dob) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await api.POST("/students", {
                body: form,
            });

            if (error) {
                setError("Failed to add student");
                return;
            }

            onSubmit?.(form);
            setSuccess(true);

            // reset form
            setForm({
                student_id: 0,
                name: "",
                class: "",
                dob: "",
            });
        } catch (err) {
            console.error(err);
            setError("Unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <h3 className="mb-4 text-2xl font-semibold">Add Student</h3>

            {error && (
                <Alert color="failure" className="mb-4">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert color="success" className="mb-4">
                    Student added successfully
                </Alert>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="student_id">Student ID</Label>
                    <TextInput
                        id="student_id"
                        name="student_id"
                        type="number"
                        value={form.student_id}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>

                <div>
                    <Label htmlFor="name">Name</Label>
                    <TextInput
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>

                <div>
                    <Label htmlFor="class">Class Name</Label>
                    <TextInput
                        id="class"
                        name="class"
                        value={form.class}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>

                <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <TextInput
                        id="dob"
                        name="dob"
                        type="date"
                        value={form.dob}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="mt-6">
                <Button onClick={submitForm} disabled={loading}>
                    {loading ? "Saving..." : "+ Add Student"}
                </Button>
            </div>
        </Card>
    );
};

export default StudentAddForm;
