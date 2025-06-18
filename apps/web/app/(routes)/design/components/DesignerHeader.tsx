import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    IconCloudCheck,
    IconCrown,
    IconMessage2,
    IconUpload,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const DesignerHeader = () => {
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
                <Separator
                    orientation="vertical"
                    className="mx-3 ml-5 min-h-8 opacity-30"
                />
                <div className="flex items-center">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer border-none text-white transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <IconArrowBackUp strokeWidth="1.75" className="size-6" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="ml-3 cursor-pointer border-none text-white transition-colors hover:bg-white/5 hover:text-white"
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
            </div>
            <div className="flex items-center">
                <Input
                    placeholder="Untitled design"
                    value="Untitled design"
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
        </div>
    );
};

export default DesignerHeader;
