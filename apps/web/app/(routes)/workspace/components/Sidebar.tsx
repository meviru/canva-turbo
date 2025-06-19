"use client";
import { Button } from '@/components/ui/button';
import { UserButton } from '@stackframe/stack';
import { IconIndentDecrease, IconPlus } from "@tabler/icons-react";
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { workspaceMenuItems } from '../constants';
import CreateNewCanvas from './CreateNewCanvas';
import SidebarExpanded from './SidebarExpanded';
import { cn } from '@/lib/utils';

const Sidebar = () => {
    const path = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    return (
        <div className="h-screen flex sticky top-0">
            <div className="h-screen flex flex-col items-center w-[72px] p-2 pb-4">
                <Button
                    variant="ghost"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    className={cn(
                        "size-10 p-0 cursor-pointer rounded-lg transition-colors",
                        "text-gray-400 dark:text-white/70",
                        "hover:bg-purple-200 dark:hover:bg-white/5",
                        "hover:text-violet-600 dark:hover:text-white"
                    )}
                >
                    <IconIndentDecrease
                        className={`size-6 transition-transform ${!isDrawerOpen ? "-scale-100" : ""}`}
                        strokeWidth={1.5}
                    />
                </Button>


                <CreateNewCanvas>
                    <div className="group flex flex-col items-center justify-center p-2 mt-2 mb-3 cursor-pointer">
                        <IconPlus className="bg-violet-600 dark:bg-violet-500 rounded-full p-1 size-8 text-white transition-colors group-hover:bg-violet-700 dark:group-hover:bg-violet-600" />
                        <h2 className="text-[11px] text-violet-600 dark:text-violet-400 mt-1">Create</h2>
                    </div>
                </CreateNewCanvas>

                <div className="grow">
                    {workspaceMenuItems.map((menu, i) => {
                        const IconTag = menu.path !== path ? menu.icon : menu.iconFilled;
                        const isActive = menu.path === path;

                        return (
                            <div
                                key={i}
                                className="group p-1 flex items-center flex-col mb-2 cursor-pointer"
                            >
                                <IconTag
                                    strokeWidth={1.5}
                                    className={cn(
                                        "p-1.5 size-10 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-purple-200 text-violet-600 dark:bg-white/10 dark:text-white"
                                            : "text-gray-400 dark:text-white/70",
                                        "group-hover:bg-purple-200 dark:group-hover:bg-white/10",
                                        "group-hover:text-violet-600 dark:group-hover:text-white"
                                    )}
                                />
                                <h2
                                    className={cn(
                                        "text-[11px] font-medium transition-colors",
                                        isActive
                                            ? "text-violet-600 dark:text-white"
                                            : "text-gray-400 dark:text-white/70",
                                        "group-hover:text-violet-600 dark:group-hover:text-white"
                                    )}
                                >
                                    {menu.name}
                                </h2>
                            </div>
                        );
                    })}
                </div>
                <UserButton />
            </div>

            {isDrawerOpen && <SidebarExpanded />}
        </div>
    );
};


export default Sidebar