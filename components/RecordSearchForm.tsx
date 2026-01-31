"use client";

import React, { useState } from "react";
import {
    Card,
    Label,
    TextInput,
    Button,
    Table,
    TableBody,
    TableHead,
    TableHeadCell,
    TableRow,
    TableCell,
} from "flowbite-react";
import { Search } from "flowbite-react-icons/solid";

import api from "@/lib/api/client";
import { components } from "@/lib/api/types";

type HealthRecord = components["schemas"]["HealthRecord"];

const HealthRecordSearch: React.FC = () => {
    const [filters, setFilters] = useState({
        record_id: "",
        min_weight: "",
        max_weight: "",
        min_height: "",
        max_height: "",
        start_date: "",
        end_date: "",
    });

    const [results, setResults] = useState<HealthRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const searchRecords = async () => {
        setLoading(true);

        try {
            const response = await api.GET("/health-records/search", {
                params: {
                    query: {
                        record_id: filters.record_id
                            ? Number(filters.record_id)
                            : undefined,
                        minWeight: filters.min_weight
                            ? Number(filters.min_weight)
                            : undefined,
                        maxWeight: filters.max_weight
                            ? Number(filters.max_weight)
                            : undefined,
                        minHeight: filters.min_height
                            ? Number(filters.min_height)
                            : undefined,
                        maxHeight: filters.max_height
                            ? Number(filters.max_height)
                            : undefined,
                        startDate: filters.start_date || undefined,
                        endDate: filters.end_date || undefined,
                    }
                }
            });
            if (response.data) {
                setResults(response.data);
            }

        } catch {
            setResults([]);
        }
    };

    return (
        <Card>
            <h3 className="mb-6 text-2xl font-semibold">
                Search Health Records
            </h3>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <Label htmlFor="record_id">Record ID</Label>
                    <TextInput
                        id="record_id"
                        name="record_id"
                        placeholder="Record ID"
                        value={filters.record_id}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="min_weight">Min Weight (kg)</Label>
                    <TextInput
                        id="min_weight"
                        name="min_weight"
                        type="number"
                        placeholder="Min weight"
                        value={filters.min_weight}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="max_weight">Max Weight (kg)</Label>
                    <TextInput
                        id="max_weight"
                        name="max_weight"
                        type="number"
                        placeholder="Max weight"
                        value={filters.max_weight}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="min_height">Min Height (cm)</Label>
                    <TextInput
                        id="min_height"
                        name="min_height"
                        type="number"
                        placeholder="Min height"
                        value={filters.min_height}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="max_height">Max Height (cm)</Label>
                    <TextInput
                        id="max_height"
                        name="max_height"
                        type="number"
                        placeholder="Max height"
                        value={filters.max_height}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <TextInput
                        id="start_date"
                        name="start_date"
                        type="date"
                        value={filters.start_date}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <TextInput
                        id="end_date"
                        name="end_date"
                        type="date"
                        value={filters.end_date}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Search button */}
            <div className="mt-6">
                <Button onClick={searchRecords} disabled={loading}>
                    <Search className="mr-2 h-4 w-4" />
                    {loading ? "Searching..." : "Search"}
                </Button>
            </div>

            {/* Results table */}
            <div className="mt-8 overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableHeadCell>Record ID</TableHeadCell>
                        <TableHeadCell>Student ID</TableHeadCell>
                        <TableHeadCell>Date</TableHeadCell>
                        <TableHeadCell>Weight (kg)</TableHeadCell>
                        <TableHeadCell>Height (cm)</TableHeadCell>
                        <TableHeadCell>Notes</TableHeadCell>
                    </TableHead>

                    <TableBody className="divide-y">
                        {results.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center text-gray-500"
                                >
                                    No records found
                                </TableCell>
                            </TableRow>
                        ) : (
                            results.map((r) => (
                                <TableRow key={r.record_id}>
                                    <TableCell>{r.record_id}</TableCell>
                                    <TableCell>{r.student_id}</TableCell>
                                    <TableCell>{r.date}</TableCell>
                                    <TableCell>{r.weight}</TableCell>
                                    <TableCell>{r.height}</TableCell>
                                    <TableCell>{r.notes || "-"}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};

export default HealthRecordSearch;
