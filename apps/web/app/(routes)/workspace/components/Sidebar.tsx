"use client";
import { Button } from '@/components/ui/button';
import { UserButton } from '@stackframe/stack';
import { IconIndentDecrease, IconPlus } from "@tabler/icons-react";
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { workspaceMenuItems } from '../constants';
import CreateNewCanvas from './CreateNewCanvas';
import SidebarExpanded from './SidebarExpanded';

const Sidebar = () => {
    const path = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
    return (
        <div className='h-screen flex sticky top-0'>
            <div className="h-screen flex flex-col items-center w-[72px] p-2 pb-4 bg-violet-50">
                <Button variant="ghost" onClick={() => setIsDrawerOpen(!isDrawerOpen)} className='text-gray-500 size-10 p-0 cursor-pointer hover:bg-purple-200 hover:text-violet-600'>
                    <IconIndentDecrease className={`size-6 ${!isDrawerOpen ? "-scale-100" : ""}`} strokeWidth={1.5} />
                </Button>
                <CreateNewCanvas>
                    <div className="group flex flex-col items-center justify-center p-2 mt-2 mb-3 cursor-pointer">
                        <IconPlus className="bg-violet-600 rounded-full p-1 size-8 text-white transition-colors group-hover:bg-violet-700" />
                        <h2 className="text-[11px] text-violet-600 mt-1">Create</h2>
                    </div>
                </CreateNewCanvas>
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
            {isDrawerOpen && (
                <SidebarExpanded />
            )}
        </div>
    )
}

export default Sidebar