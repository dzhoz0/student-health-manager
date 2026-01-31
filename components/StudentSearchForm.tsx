"use client";

import React, { useState } from "react";
import { Card, Label, TextInput, Button } from "flowbite-react";
import { components } from "@/lib/api/types";
import api from "@/lib/api/client";
type Student = components["schemas"]["Student"];

type Filters = {
    student_id: string;
    name: string;
    class: string;
    dob: string;
};

const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${String(d.getMonth() + 1).padStart(2, "0")} / ${String(
        d.getDate(),
    ).padStart(2, "0")} / ${d.getFullYear()}`;
};

const StudentSearchForm: React.FC = () => {
    const [filters, setFilters] = useState<Filters>({
        student_id: "",
        name: "",
        class: "",
        dob: "",
    });

    const [results, setResults] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const doSearch = async () => {
        setLoading(true);

        try {
            const response = await api.GET("/students/search", {
                params: {
                    query: {
                        student_id: filters.student_id
                            ? Number(filters.student_id)
                            : undefined,
                        name: filters.name || undefined,
                        class: filters.class || undefined,
                        dob: filters.dob || undefined,
                    },
                },
            });

            if (response.data) {
                setResults(response.data);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Search failed:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };



    return (
        <Card>
            <h3 className="mb-4 text-2xl font-semibold">Search Students</h3>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                    <Label htmlFor="student_id">Student ID</Label>
                    <TextInput
                        id="student_id"
                        name="student_id"
                        placeholder="Student ID"
                        value={filters.student_id}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="name">Name</Label>
                    <TextInput
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={filters.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="class">Class Name</Label>
                    <TextInput
                        id="class"
                        name="class"
                        placeholder="Class"
                        value={filters.class}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <TextInput
                        id="dob"
                        name="dob"
                        type="date"
                        value={filters.dob}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mb-6">
                <Button onClick={doSearch}>🔍 Search</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-white text-xs text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Student ID</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Class</th>
                            <th className="px-6 py-3">Date of Birth</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-4 text-center text-gray-500"
                                >
                                    Searching...
                                </td>
                            </tr>
                        ) : results.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    No students found
                                </td>
                            </tr>
                        ) : (
                            results.map((s) => (
                                <tr key={s.student_id} className="border-t">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {s.student_id}
                                    </td>
                                    <td className="px-6 py-4">{s.name}</td>
                                    <td className="px-6 py-4">{s.class}</td>
                                    <td className="px-6 py-4">
                                        {formatDate(s.dob)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default StudentSearchForm;
