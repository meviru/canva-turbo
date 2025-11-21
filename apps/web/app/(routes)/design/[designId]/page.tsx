"use client";

import { CanvasProvider } from "@/hooks/useCanvas";
import { useGetDesignByIdQuery } from "@/services/design.service";
import { getUserFromStorage } from "@/shared/lib/storage";
import type { Design, DesignerMode, User } from "@/shared/models";
import { IconPencil } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CanvasEditor from "../components/CanvasEditor";
import DesignerHeader from "../components/DesignerHeader";
import DesignSidebar from "../components/DesignerSidebar";
import ErrorBoundary from "@/components/ui/error-boundary";

const DesignEditor = () => {
    // Get designId from URL parameters
    const { designId } = useParams();
    // State to hold design information
    const [designInfo, setDesignInfo] = useState<Design | null>(null);

    // Get user from safe storage
    const user: User | null = getUserFromStorage();

    // Set designer mode state
    const [designerMode, setDesignerMode] = useState<DesignerMode>({
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

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Please log in to access the design editor.</p>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <CanvasProvider>
                <div className="flex flex-col h-screen bg-gray-100 dark:bg-[#0d1216]">
                    <DesignerHeader user={user} designInfo={designInfo} designerMode={designerMode} setDesignerMode={setDesignerMode} />
                    <div className="flex flex-1 overflow-hidden">
                        <DesignSidebar designerMode={designerMode} />
                        <div className="flex-1 overflow-auto">
                            <CanvasEditor designInfo={designInfo} designerMode={designerMode} />
                        </div>
                    </div>
                </div>
            </CanvasProvider>
        </ErrorBoundary>
    );
};

export default DesignEditor;