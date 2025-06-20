"use client";

import dynamic from "next/dynamic";

const tabs: any = {
    background: dynamic(() => import("./tabs/BackgroundTab"), { ssr: false }),
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
