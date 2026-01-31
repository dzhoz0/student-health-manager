import React from "react";
import StudentAddForm from "@/components/StudentAddForm";
import StudentSearchForm from "@/components/StudentSearchForm";

function Page() {
    return (
        <div className="flex flex-col gap-2 p-5 pr-40 pl-40">
            <StudentAddForm />
            <StudentSearchForm />
        </div>
    );
}

export default Page;
