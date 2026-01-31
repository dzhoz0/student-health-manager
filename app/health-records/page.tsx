import React from "react";
import HealthRecordAdd from "@/components/RecordAddForm";
import HealthRecordSearch from "@/components/RecordSearchForm";

function Page() {
    return (
        <div className="flex flex-col gap-2 p-5 pl-40 pr-40">
            <HealthRecordAdd />
            <HealthRecordSearch />
        </div>
    );
}

export default Page;
