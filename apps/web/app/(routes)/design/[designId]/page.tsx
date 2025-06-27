"use client";

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import CanvasEditor from "../components/CanvasEditor"
import DesignerHeader from "../components/DesignerHeader"
import DesignSidebar from "../components/DesignerSidebar"
import { useGetDesignByIdQuery } from "@/services/design.service";
import { IconPencil } from "@tabler/icons-react";

const DesignEditor = () => {
    // Get designId from URL parameters
    const { designId } = useParams();
    // State to hold design information
    const [designInfo, setDesignInfo] = useState({});

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user") as string);

    // Set designer mode state
    const [designerMode, setDesignerMode] = useState({
        name: "Editing",
        icon: IconPencil
    });

    // Fetch design data using the designId
    const { data } = useGetDesignByIdQuery(designId as string, {
        skip: !designId
    });

    // Update designInfo state when data is fetched
    useEffect(() => {
        if (data) {
            setDesignInfo(data.design);
        }
    }, [designId, data]);

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-[#0d1216]">
            <DesignerHeader user={user} designInfo={designInfo} designerMode={designerMode} setDesignerMode={setDesignerMode} />
            <div className="flex flex-1 overflow-hidden">
                <DesignSidebar designerMode={designerMode} />
                <div className="flex-1 overflow-auto">
                    <CanvasEditor designInfo={designInfo} />
                </div>
            </div>
        </div>
    )
}

export default DesignEditor