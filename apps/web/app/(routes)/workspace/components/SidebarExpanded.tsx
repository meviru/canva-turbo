import { Button } from "@/components/ui/button";
import { IconCrown, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import logo from "public/Canva_Logo.svg";

const SidebarExpanded = () => {
    return (
        <div className="h-screen flex flex-col border-l border-gray-300 dark:border-white/10 w-[264px]">
            <div className="flex flex-col p-4 pb-6">
                <Image src={logo.src} width={80} height={30} alt="Canva" className="dark:invert brightness-0" />
                <Button className="bg-white h-[38px] text-gray-900 flex items-center shadow-none justify-center gap-2 mt-8 w-full cursor-pointer hover:bg-white">
                    <IconCrown color="#fdbc68" fill="#fdbc68" />
                    Upgrade your plan
                </Button>
            </div>

            <div className="grow p-4 pt-0 overflow-y-auto">
                <h4 className="text-[12px] text-gray-600 dark:text-zinc-400 font-semibold">
                    Recent designs
                </h4>
            </div>

            <div className="p-4 pt-0">
                <Button
                    variant="ghost"
                    className="w-full h-[38px] text-gray-900 dark:text-white flex items-center justify-start gap-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                >
                    <IconTrash className="size-5 -mt-0.5" />
                    Trash
                </Button>
            </div>
        </div>
    );
};

export default SidebarExpanded