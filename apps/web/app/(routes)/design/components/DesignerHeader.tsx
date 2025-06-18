"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserButton } from "@stackframe/stack";
import {
    IconArrowBackUp,
    IconArrowForwardUp,
    IconCheck,
    IconChevronDown,
    IconCloudCheck,
    IconCrown,
    IconFrame,
    IconMessage2,
    IconPencil,
    IconUpload,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { editMenuItems, fileMenuItems } from "../constants";

const DesignerHeader = ({ designInfo }: { designInfo: any }) => {
    const [designName, setDesignName] = useState(designInfo?.name);

    const [designerMode, setDesignerMode] = useState({
        name: "Editing",
        icon: IconPencil
    });

    return (
        <div className="sticky top-0 z-10 p-2 px-5 flex items-center justify-between bg-linear-90 from-[#00c4cc] to-[#7d2ae8]">
            <div className="flex items-center">
                <Link href={"/workspace"}>
                    <Image
                        src={"/Canva_Logo.svg"}
                        width={80}
                        height={50}
                        alt={"logo"}
                        loading="lazy"
                        className="brightness-0 invert"
                    />
                </Link>
                <div className="flex gap-1">
                    <Menubar className="bg-transparent border-0 ml-5 shadow-none">
                        <MenubarMenu>
                            <MenubarTrigger className="text-white">File</MenubarTrigger>
                            <MenubarContent className="p-0 w-80">
                                {fileMenuItems.map((item, index) => (
                                    <>
                                        {item.name ? (
                                            <MenubarItem key={index} className="p-3 rounded-none text-gray-900 cursor-pointer">
                                                <item.icon className="mx-1 size-[24px] text-gray-700" />
                                                {item.name} <MenubarShortcut>{item.shortcut}</MenubarShortcut>
                                            </MenubarItem>
                                        ) : (
                                            item.component && <item.component className="my-1.5" />
                                        )}
                                    </>
                                ))}
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                    <Menubar className="bg-transparent border-0 shadow-none">
                        <MenubarMenu>
                            <MenubarTrigger className="text-white pl-3">
                                <designerMode.icon size={20} />
                                <span className="mx-2">{designerMode.name}</span>
                                <IconChevronDown size={18} />
                            </MenubarTrigger>
                            <MenubarContent className="p-0 w-80">
                                {editMenuItems.map((item, index) => (
                                    <MenubarItem key={index} onClick={() => setDesignerMode(item)} className="py-2 rounded-none text-gray-900 cursor-pointer">
                                        <item.icon className="ml-1 mr-2 size-6 text-gray-700" />
                                        <div className="flex flex-col gap-1">
                                            <span>{item.name}</span>
                                            <span className="text-xs text-muted-foreground">{item.description}</span>
                                        </div>
                                        {designerMode.name == item.name && (
                                            <IconCheck className="ml-auto mr-1 size-5 text-gray-900" />
                                        )}
                                    </MenubarItem>
                                ))}
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
                {designerMode.name == "Editing" && (
                    <>
                        <Separator
                            orientation="vertical"
                            className="mx-3 ml-5 min-h-8 opacity-30"
                        />
                        <div className="flex items-center">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="cursor-pointer border-none text-white transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <IconArrowBackUp strokeWidth="1.75" className="size-6" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="ml-3 cursor-pointer border-none text-white transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <IconArrowForwardUp strokeWidth="1.75" className="size-6" />
                            </Button>
                        </div>
                        <Separator orientation="vertical" className="mx-3 min-h-8 opacity-30" />
                        <Tooltip>
                            <TooltipTrigger className="cursor-pointer border-none text-white">
                                <IconCloudCheck strokeWidth="1.75" className="size-6" />
                            </TooltipTrigger>
                            <TooltipContent>All changes saved</TooltipContent>
                        </Tooltip>
                    </>
                )}
            </div >
            <div className="flex items-center">
                <Input
                    placeholder="Untitled design"
                    value={designName}
                    onChange={(e) => setDesignName(e.target.value)}
                    className="shadow-none font-medium h-10 max-w-56 placeholder:text-white border-1 border-transparent text-white mr-4 transition-all focus-visible:ring-0 hover:border-white/30 focus:border-white/30"
                />
                <Button
                    className="flex items-center mr-4 cursor-pointer border-1 border-white/30 text-white transition-colors hover:bg-white/5 hover:text-white"
                    size="lg"
                    variant="ghost"
                >
                    <IconCrown className="size-5" color="#fdbc68" fill="#fdbc68" />
                    Upgrade your plan
                </Button>
                <UserButton />
                <Button
                    size="icon"
                    variant="ghost"
                    className="ml-4 cursor-pointer border-1 border-white/30 text-white transition-colors hover:bg-white/5 hover:text-white"
                >
                    <IconMessage2 strokeWidth="1.75" className="size-5" />
                </Button>
                <Button
                    className="flex items-center ml-4 cursor-pointer"
                    size="lg"
                    variant="outline"
                >
                    <IconUpload strokeWidth="1.75" className="size-5" />
                    Share
                </Button>
            </div>
        </div >
    );
};

export default DesignerHeader;
