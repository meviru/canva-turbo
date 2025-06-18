import { Button } from "@/components/ui/button";
import { IconCrown, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import logo from "public/Canva_Logo.svg";

const SidebarExpanded = () => {
    return (
        <div className="h-screen flex flex-col border-l border-l-gray-300 w-[264px] bg-violet-50">
            <div className='flex flex-col p-4 pb-6'>
                <Image src={logo.src} width={80} height={30} alt="Canva" />
                <Button className="bg-white h-[38px] text-gray-950 flex items-center justify-center gap-2 mt-8 w-full cursor-pointer hover:bg-white">
                    <IconCrown color="#fdbc68" fill="#fdbc68" /> Upgrade your plan
                </Button>
            </div>
            <div className="grow p-4 pt-0 overflow-y-auto">
                <h4 className='text-[12px] text-gray-600 font-semibold'>Recent designs</h4>
            </div>
            <div className="p-4 pt-0">
                <Button variant="ghost" className="w-full h-[38px] flex items-center justify-start gap-2 cursor-pointer hover:bg-black/5">
                    <IconTrash className="size-5 -mt-0.5" /> Trash
                </Button>
            </div>
        </div>
    )
}

export default SidebarExpanded