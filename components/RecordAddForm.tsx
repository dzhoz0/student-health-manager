"use client";

import React, { useState } from "react";
import {
    Card,
    Label,
    TextInput,
    Textarea,
    Button,
    Popover,
    Spinner,
    Alert,
} from "flowbite-react";
import { InfoCircle } from "flowbite-react-icons/solid";

import api from "@/lib/api/client";
import { components } from "@/lib/api/types";

type Student = components["schemas"]["Student"];

const HealthRecordAdd: React.FC = () => {
    // form fields
    const [studentId, setStudentId] = useState("");
    const [date, setDate] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [notes, setNotes] = useState("");

    // student info
    const [student, setStudent] = useState<Student | null>(null);
    const [loadingStudent, setLoadingStudent] = useState(false);
    const [studentError, setStudentError] = useState<string | null>(null);

    // submit state
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // load student info
    const loadStudent = async () => {
        if (!studentId) return;

        setLoadingStudent(true);
        setStudentError(null);
        setStudent(null);

        try {
            const { data, error } = await api.GET("/students/{student_id}", {
                params: {
                    path: { student_id: Number(studentId) },
                },
            });

            if (error || !data) {
                setStudentError("Student not found");
            } else {
                setStudent(data);
            }
        } catch {
            setStudentError("Failed to load student");
        } finally {
            setLoadingStudent(false);
        }
    };

    // submit health record
    const submitRecord = async () => {
        setSubmitError(null);
        setSubmitSuccess(false);

        if (!studentId || !date || !weight || !height) {
            setSubmitError("Please fill all required fields.");
            return;
        }

        setSubmitting(true);

        const payload = {
            student_id: Number(studentId),
            date,
            weight: Number(weight),
            height: Number(height),
            notes: notes || undefined,
            record_id: 0, // will be auto-generated
        };

        try {
            const { error } = await api.POST("/health-records", {
                body: payload,
            });

            if (error) {
                setSubmitError("Failed to add health record. Please try again.");
                return;
            }

            // success
            setSubmitSuccess(true);
            setDate("");
            setWeight("");
            setHeight("");
            setNotes("");
        } catch {
            setSubmitError("Unexpected error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // popover content
    const studentPopover = (
        <div className="w-64 text-sm">
            {loadingStudent ? (
                <div className="flex items-center gap-2 p-3">
                    <Spinner size="sm" />
                    <span>Loading student...</span>
                </div>
            ) : studentError ? (
                <div className="p-3 text-red-600">{studentError}</div>
            ) : student ? (
                <div className="space-y-1 p-3">
                    <div>
                        <strong>Name:</strong> {student.name}
                    </div>
                    <div>
                        <strong>Class:</strong> {student.class}
                    </div>
                    <div>
                        <strong>DOB:</strong> {student.dob}
                    </div>
                </div>
            ) : (
                <div className="p-3 text-gray-500">
                    Enter Student ID and click info
                </div>
            )}
        </div>
    );

    return (
        <Card>
            <h3 className="mb-6 text-2xl font-semibold">Add Health Record</h3>

            {/* Success / Error */}
            {submitSuccess && (
                <Alert color="success" className="mb-4">
                    Health record added successfully.
                </Alert>
            )}

            {submitError && (
                <Alert color="failure" className="mb-4">
                    {submitError}
                </Alert>
            )}

            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="student_id">Student ID</Label>

                    <div className="flex w-full items-end gap-2">
                        {/* Input takes full width */}
                        <div className="flex-1">
                            <TextInput
                                id="student_id"
                                type="number"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            />
                        </div>

                        {/* Info button */}
                        <Popover content={studentPopover} placement="right">
                            <Button
                                color="gray"
                                onClick={loadStudent}
                                disabled={!studentId}
                                className="flex h-10 w-10 items-center justify-center p-0"
                            >
                                <InfoCircle className="h-5 w-5" />
                            </Button>
                        </Popover>
                    </div>
                </div>

                <div>
                    <Label htmlFor="date">Date</Label>
                    <TextInput
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Row 2 */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <TextInput
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <TextInput
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            {/* Action */}
            <div className="mt-6">
                <Button onClick={submitRecord} disabled={submitting}>
                    {submitting ? "Saving..." : "+ Add Record"}
                </Button>
            </div>
        </Card>
    );
};

export default HealthRecordAdd;
