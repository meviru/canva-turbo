"use client";

import { UserButton } from '@stackframe/stack';
import { IconPlus } from "@tabler/icons-react";
import { usePathname } from 'next/navigation';
import { workspaceMenuItems } from '../constants';

const Sidebar = () => {
    const path = usePathname();
    return (
        <div className="h-screen flex flex-col items-center w-[75px] p-2 pb-4 shadow bg-violet-50">
            <div className="group flex flex-col items-center justify-center p-2 mb-2 cursor-pointer">
                <IconPlus className="bg-violet-600 rounded-full p-1 h-8 w-8 text-white transition-colors group-hover:bg-violet-700" />
                <h2 className="text-xs text-violet-600 mt-1">Create</h2>
            </div>
            <div className="grow">
                {workspaceMenuItems.map((menu, i) => {
                    const IconTag = menu.path !== path ? menu.icon : menu.iconFilled;
                    return (
                        <div
                            key={i}
                            className="group p-1 flex items-center flex-col mb-2 cursor-pointer"
                        >
                            <IconTag
                                width={40}
                                height={40}
                                strokeWidth={1.5}
                                className={`p-2 rounded-lg text-gray-500 transition-colors group-hover:bg-purple-200 group-hover:text-violet-600 ${menu.path === path && "bg-purple-200 text-violet-600"}`}
                            />
                            <h2
                                className={`text-[11px] font-medium text-gray-500 transition-colors group-hover:text-violet-600 ${menu.path === path && "text-violet-600"}`}
                            >
                                {menu.name}
                            </h2>
                        </div>
                    );
                })}
            </div>
            <UserButton />
        </div>
    )
}

export default Sidebar