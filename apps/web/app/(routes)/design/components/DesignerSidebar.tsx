"use client";
import { cn } from "@/lib/utils";
import { IconCrown } from "@tabler/icons-react";
import { useState } from "react";
import { sideBarMenu } from "../constants";
import SidebarSettings from "./SidebarSettings";
import { useTheme } from "next-themes";

const DesignSidebar = () => {
    const [selectedMenu, setSelectedMenu] = useState<any>("");
    const { theme } = useTheme();

    return (
        <div
            className={cn(
                "sticky top-0 z-10 py-1.5 flex",
                selectedMenu.name && "bg-background dark:bg-zinc-800"
            )}
        >
            <ul className="w-[75px] flex flex-col">
                {sideBarMenu.map((menu: any, index: number) => {
                    return (
                        <li
                            key={index}
                            onClick={() => setSelectedMenu(menu)}
                            className="group flex flex-col items-center justify-center h-[75px] cursor-pointer"
                        >
                            <div
                                className={cn(
                                    "relative flex items-center justify-center size-8 rounded-md border border-transparent group-hover:border-zinc-200 text-gray-500 dark:text-zinc-300 transition-all",
                                    selectedMenu.name === menu.name
                                        ? "bg-background shadow-md border-zinc-200 dark:bg-zinc-700 dark:border-zinc-600 dark:backdrop-blur-lg"
                                        : "",
                                    "group-hover:bg-background group-hover:shadow-md dark:group-hover:bg-zinc-700 dark:group-hover:border-zinc-600 dark:hover:backdrop-blur-lg"
                                )}
                            >
                                {menu.name.toLowerCase() === "ai" && (
                                    <IconCrown
                                        size="14"
                                        color="#fdbc68"
                                        fill="#fdbc68"
                                        className="absolute -top-1.5 -right-1.5"
                                    />
                                )}
                                <menu.icon
                                    strokeWidth="1.65"
                                    className={cn(
                                        "transition-opacity",
                                        selectedMenu.name === menu.name ? "opacity-0" : "",
                                        "group-hover:opacity-0"
                                    )}
                                />
                                <menu.iconFilled
                                    strokeWidth="1.65"
                                    fill={menu.iconColor}
                                    color={menu.iconColor}
                                    className={cn(
                                        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity",
                                        selectedMenu.name !== menu.name ? "opacity-0" : "",
                                        "group-hover:opacity-100"
                                    )}
                                />
                            </div>
                            <h2 className="text-[11px] font-medium text-gray-500 dark:text-zinc-300 transition-colors">
                                {menu.name}
                            </h2>
                        </li>
                    )
                })}
            </ul>
            {selectedMenu && <SidebarSettings selectedMenu={selectedMenu} />}
        </div>
    );
};

export default DesignSidebar;
