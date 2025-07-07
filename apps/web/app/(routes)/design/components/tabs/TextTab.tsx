import { useCanvas } from "@/hooks/useCanvas";
import clsx from "clsx";
import * as fabric from "fabric";
import { useState } from "react";
import { textSizeOptions } from "../../constants";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";

const TextTab = () => {
    const [searchValue, setSearchValue] = useState('');
    const { canvas } = useCanvas();

    const addText = (text: string, fontSize: number, bold: boolean) => {
        if (!canvas) return;
        const textbox = new fabric.Textbox(text, {
            fontFamily: "Poppins",
            fontSize: fontSize,
            fontWeight: bold ? "bold" : "normal",
            left: 50,
            top: 50,
        });
        canvas.add(textbox);
        canvas.setActiveObject(textbox);
        canvas.renderAll();
    };

    return (
        <div className="flex flex-col h-full">
            <TabHeader>
                <TabSearchBox placeholder="Search fonts and combinations" value={searchValue} onChange={(value) => { setSearchValue(value) }} />
            </TabHeader>
            <div className="grow overflow-y-auto p-4 pt-0 ">
                <ul className="space-y-2">
                    <li className="text-sm font-semibold mb-3 text-gray-800 dark:text-white/90">Default text styles</li>
                    {textSizeOptions.map((option, index) => {
                        return (
                            <li
                                key={index}
                                className={clsx(
                                    "p-3 rounded-md cursor-pointer border transition-colors",
                                    "border-gray-300 dark:border-zinc-600",
                                    "hover:bg-zinc-100 dark:hover:bg-zinc-700",
                                    option.fontClass
                                )}
                                onClick={() => addText(option.name, option.fontSize, option.bold)}>
                                {option.name}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default TextTab