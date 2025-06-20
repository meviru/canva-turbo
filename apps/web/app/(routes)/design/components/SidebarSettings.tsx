"use client";

import dynamic from "next/dynamic";

const tabs: any = {
    designs: dynamic(() => import("./tabs/DesignsTab"), { ssr: false }),
    elements: dynamic(() => import("./tabs/ElementsTab"), { ssr: false }),
    text: dynamic(() => import("./tabs/TextTab"), { ssr: false }),
    uploads: dynamic(() => import("./tabs/UploadsTab"), { ssr: false }),
    photos: dynamic(() => import("./tabs/PhotosTab"), { ssr: false }),
    background: dynamic(() => import("./tabs/BackgroundTab"), { ssr: false }),
    ai: dynamic(() => import("./tabs/AITab"), { ssr: false }),
    settings: dynamic(() => import("./tabs/SettingsTab"), { ssr: false }),
}

const SidebarSettings = ({ selectedMenu }: { selectedMenu: any }) => {
    const TabComponent = tabs[selectedMenu.name.toLowerCase()];
    if (!TabComponent) return null;

    return (
        <div className="w-[360px] h-screen border-r dark:border-white/10">
            <TabComponent />
        </div>
    );
};

export default SidebarSettings;
