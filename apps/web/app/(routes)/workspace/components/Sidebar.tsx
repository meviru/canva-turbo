"use client";
import { useState } from 'react';
import { UserButton } from '@stackframe/stack';
import { IconCrown, IconIndentDecrease, IconIndentIncrease, IconPlus } from "@tabler/icons-react";
import { usePathname } from 'next/navigation';
import { workspaceMenuItems } from '../constants';
import logo from "public/Canva_Logo.svg";
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
    const path = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
    return (
        <div className='h-screen flex'>
            <div className="h-screen flex flex-col items-center w-[72px] p-2 pb-4 bg-violet-50">
                <Button variant="ghost" onClick={() => setIsDrawerOpen(!isDrawerOpen)} className='text-gray-500 size-10 p-0 cursor-pointer hover:bg-purple-200 hover:text-gray-500'>
                    {isDrawerOpen ? (
                        <IconIndentDecrease className='size-6' />
                    ) : (
                        <IconIndentIncrease className='size-6' />
                    )}
                </Button>
                <div className="group flex flex-col items-center justify-center p-2 mt-2 mb-3 cursor-pointer">
                    <IconPlus className="bg-violet-600 rounded-full p-1 size-8 text-white transition-colors group-hover:bg-violet-700" />
                    <h2 className="text-[11px] text-violet-600 mt-1">Create</h2>
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
            {isDrawerOpen && (
                <div className="h-screen flex flex-col border-l border-l-gray-300 w-[264px] p-4 bg-violet-50">
                    <div className='flex flex-col'>
                        <Image src={logo.src} width={80} height={30} alt="Canva" />
                        <Button className="bg-white h-[38px] text-gray-950 flex items-center justify-center gap-2 mt-8 w-full cursor-pointer hover:bg-white">
                            <IconCrown color="#fdbc68" fill="#fdbc68" /> Upgrade your plan
                        </Button>
                    </div>
                    <div className="flex flex-col">
                        <h4 className='text-[12px] text-gray-600 font-semibold mt-6'>Recent designs</h4>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar