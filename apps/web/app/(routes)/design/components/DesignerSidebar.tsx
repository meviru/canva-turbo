"use client";
import { IconCrown } from "@tabler/icons-react";
import { useState } from "react";
import { sideBarMenu } from "../constants";
import SidebarSettings from "./SidebarSettings";

const DesignSidebar = () => {
    const [selectedMenu, setSelectedMenu] = useState<any>("");

    return (
        <div
            className={`sticky top-0 z-10 flex ${selectedMenu.name ? "bg-white" : ""}`}
        >
            <ul className="w-[75px] flex flex-col">
                {sideBarMenu.map((menu: any, index: number) => (
                    <li
                        key={index}
                        onClick={() => setSelectedMenu(menu)}
                        className="group flex flex-col items-center justify-center h-[75px] cursor-pointer"
                    >
                        <div
                            className={`relative flex items-center justify-center size-8 rounded-md text-gray-500 transition-all ${selectedMenu.name === menu.name
                                ? "bg-white shadow-md inset-shadow-2xs"
                                : ""
                                } group-hover:bg-white group-hover:shadow-md`}
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
                                className={`transition-opacity ${selectedMenu.name === menu.name ? "opacity-0" : ""
                                    } group-hover:opacity-0`}
                            />
                            <menu.iconFilled
                                strokeWidth="1.65"
                                fill={menu.iconColor}
                                color={menu.iconColor}
                                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity ${selectedMenu.name !== menu.name ? "opacity-0" : ""
                                    } group-hover:opacity-100`}
                            />
                        </div>
                        <h2 className="text-[11px] font-medium text-gray-500 transition-colors">
                            {menu.name}
                        </h2>
                    </li>
                ))}
            </ul>
            {selectedMenu && <SidebarSettings selectedMenu={selectedMenu} />}
        </div>
    );
};

export default DesignSidebar;
