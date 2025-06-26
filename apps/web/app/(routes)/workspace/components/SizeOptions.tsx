"use client";

import { useCreateDesignMutation } from "@/services/design.service";
import { getContrastColor } from "@/shared/lib/utils";
import { IconFrame } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { canvasSizeOptions } from "../constants";
import CreateNewCanvas from "./CreateNewCanvas";

const SizeOptions = () => {
    const user = useSelector((state: any) => state.user);
    const router = useRouter();
    const [createDesign] = useCreateDesignMutation();
    
    const onCanvasOptionSelect = async (option: any) => {
        try {
            await createDesign({
                name: option.name,
                width: option.width,
                height: option.height,
                userId: user._id
            }).unwrap().then((response) => {
                const { design } = response;
                router.push(`/design/${design._id}`);
            }).catch((error) => {
                console.error("Error creating design:", error);
            });
        } catch (error) {
            console.error("Failed to create design:", error)
        }
    };

    return (
        <ul className="flex my-8 pb-4 gap-5 items-start justify-center">
            {canvasSizeOptions.map((option, i) => (
                <li
                    key={i}
                    className="group flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => onCanvasOptionSelect(option)}
                >
                    <div
                        className="size-12 flex items-center justify-center rounded-full transition-transform group-hover:scale-[1.05]"
                        style={{
                            background: option.background,
                            color: option.color ? option.color : getContrastColor(option.background),
                        }}
                    >
                        <option.icon className="transition-transform group-hover:scale-[1.25]" />
                    </div>
                    <h2 className="text-xs text-gray-600 dark:text-zinc-300 text-center font-medium mt-2 mb-1 max-w-20">
                        {option.name}
                    </h2>
                    <span className="text-xs font-medium opacity-0 scale-[0.9] text-gray-400 dark:text-zinc-500 transition-opacity group-hover:opacity-100">
                        {option.width} x {option.height}px
                    </span>
                </li>
            ))}
            <CreateNewCanvas>
                <li className="group flex flex-col items-center justify-center cursor-pointer">
                    <div className="size-12 flex items-center justify-center bg-[#f2f3f5] dark:bg-zinc-800 text-gray-900 dark:text-white rounded-full transition-transform group-hover:scale-[1.05]">
                        <IconFrame className="transition-transform group-hover:scale-[1.25]" />
                    </div>
                    <h2 className="text-xs text-gray-600 dark:text-zinc-300 text-center font-medium mt-2 mb-1 max-w-20">
                        Custom size
                    </h2>
                    <span className="text-xs font-medium opacity-0 scale-[0.9] text-gray-400 dark:text-zinc-500 transition-opacity group-hover:opacity-100">
                        Create new
                    </span>
                </li>
            </CreateNewCanvas>
        </ul>
    );
};

export default SizeOptions