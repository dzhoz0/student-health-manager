"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    Button,
    TextInput,
    Label,
    Select,
    Spinner,
    Alert,
} from "flowbite-react";
import api from "@/lib/api/client";
import { components } from "@/lib/api/types";

type HealthRecord = components["schemas"]["HealthRecord"];

const HomePage: React.FC = () => {

    const [abnormalBMI, setAbnormalBMI] = useState<number[]>([]);
    const [loadingBMI, setLoadingBMI] = useState(false);

    const loadAbnormalBMI = async () => {
        setLoadingBMI(true);
        const { data } = await api.GET("/students/bmi/abnormal");
        setAbnormalBMI(Array.isArray(data) ? data : []);
        setLoadingBMI(false);
    };

    useEffect(() => {
        loadAbnormalBMI().then();
    }, []);


    const [studentId, setStudentId] = useState("");
    const [recordCount, setRecordCount] = useState<number | null>(null);
    const [countError, setCountError] = useState<string | null>(null);

    const fetchCount = async () => {
        setCountError(null);
        setRecordCount(null);

        const { data, error } = await api.GET(
            "/students/{student_id}/health-records/count",
            {
                params: { path: { student_id: Number(studentId) } },
            },
        );

        if (error || !data || typeof data.count !== "number") {
            setCountError("Student not found");
            return;
        }

        setRecordCount(data.count);
    };

    const [className, setClassName] = useState("");
    const [classAvg, setClassAvg] = useState<{
        averageHeight: number;
        averageWeight: number;
    } | null>(null);

    const fetchClassAverage = async () => {
        setClassAvg(null);

        const { data } = await api.GET(
            "/classes/{className}/health-records/average",
            {
                params: { path: { className } },
            },
        );

        if (
            data &&
            typeof data.averageHeight === "number" &&
            typeof data.averageWeight === "number"
        ) {
            setClassAvg({
                averageHeight: data.averageHeight,
                averageWeight: data.averageWeight,
            });
        }
    };


    const [outlierType, setOutlierType] = useState<"height" | "weight" | "bmi">(
        "height",
    );
    const [outliers, setOutliers] = useState<HealthRecord[]>([]);
    const [loadingOutliers, setLoadingOutliers] = useState(false);

    const fetchOutliers = async () => {
        setLoadingOutliers(true);
        const { data } = await api.GET("/health-records/outliers", {
            params: { query: { type: outlierType } },
        });
        setOutliers(Array.isArray(data) ? data : []);
        setLoadingOutliers(false);
    };

    return (
        <div className="flex flex-col gap-3 p-5 pr-40 pl-40">
            <Card>
                <h3 className="text-xl font-semibold">
                    Students with Abnormal BMI
                </h3>

                {loadingBMI ? (
                    <Spinner />
                ) : abnormalBMI.length === 0 ? (
                    <p className="text-gray-500">No abnormal BMI found</p>
                ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {abnormalBMI.map((id) => (
                            <span
                                key={id}
                                className="rounded bg-red-100 px-3 py-1 text-sm text-red-700"
                            >
                                Student #{id}
                            </span>
                        ))}
                    </div>
                )}
            </Card>

            <Card>
                <h3 className="text-xl font-semibold">
                    Student Health Check Count
                </h3>

                <div className="mt-4 flex gap-4">
                    <div className="flex-1">
                        <Label>Student ID</Label>
                        <TextInput
                            type="number"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                        />
                    </div>

                    <Button
                        className="mt-6"
                        disabled={!studentId}
                        onClick={fetchCount}
                    >
                        Check
                    </Button>
                </div>

                {countError && (
                    <Alert color="failure" className="mt-4">
                        {countError}
                    </Alert>
                )}

                {recordCount !== null && (
                    <Alert color="success" className="mt-4">
                        Health records: <b>{recordCount}</b>
                    </Alert>
                )}
            </Card>

            <Card>
                <h3 className="text-xl font-semibold">
                    Class Average Height & Weight
                </h3>

                <div className="mt-4 flex gap-4">
                    <div className="flex-1">
                        <Label>Class Name</Label>
                        <TextInput
                            placeholder="e.g. 1A"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                        />
                    </div>

                    <Button
                        className="mt-6"
                        disabled={!className}
                        onClick={fetchClassAverage}
                    >
                        Calculate
                    </Button>
                </div>

                {classAvg && (
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div className="rounded bg-blue-50 p-4">
                            <div className="text-sm text-gray-500">
                                Avg Height
                            </div>
                            <div className="text-xl font-bold">
                                {classAvg.averageHeight.toFixed(1)} cm
                            </div>
                        </div>
                        <div className="rounded bg-green-50 p-4">
                            <div className="text-sm text-gray-500">
                                Avg Weight
                            </div>
                            <div className="text-xl font-bold">
                                {classAvg.averageWeight.toFixed(1)} kg
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            <Card>
                <h3 className="text-xl font-semibold">
                    Outlier Health Records
                </h3>

                <div className="mt-4 flex items-center gap-4">
                    <Select
                        value={outlierType}
                        onChange={(e) =>
                            setOutlierType(
                                e.target.value as "height" | "weight" | "bmi",
                            )
                        }
                        className="w-24 h-10"
                    >
                        <option value="height">Height</option>
                        <option value="weight">Weight</option>
                        <option value="bmi">BMI</option>
                    </Select>

                    <Button className="h-10" onClick={fetchOutliers}>
                        Find Outliers
                    </Button>
                </div>

                {loadingOutliers ? (
                    <Spinner className="mt-4" />
                ) : outliers.length === 0 ? (
                    <p className="mt-4 text-gray-500">No outliers found</p>
                ) : (
                    <div className="mt-4 space-y-2">
                        {outliers.map((r) => (
                            <div
                                key={r.record_id}
                                className="rounded border p-3 text-sm"
                            >
                                Record #{r.record_id} | Student #{r.student_id}{" "}
                                | H: {r.height}cm | W: {r.weight}kg
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default HomePage;
