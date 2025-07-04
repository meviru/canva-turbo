import { useState } from "react";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";
import { textSizeOptions } from "../../constants";
import clsx from "clsx";

const TextTab = () => {
    const [searchValue, setSearchValue] = useState('');
    return (
        <div className="flex flex-col h-full">
            <TabHeader>
                <TabSearchBox placeholder="Search fonts and combinations" value={searchValue} onChange={(value) => { setSearchValue(value) }} />
            </TabHeader>
            <div className="grow overflow-y-auto p-4 pt-0 ">
                <ul className="space-y-2">
                    <li className="text-sm font-semibold mb-3 dark:text-white/80">Default text styles</li>
                    {textSizeOptions.map((size) => {
                        return <li className={clsx(
                            "p-3 rounded-md cursor-pointer border transition-colors",
                            "border-gray-500 dark:border-zinc-600",
                            "hover:bg-zinc-100 dark:hover:bg-zinc-700",
                            `text-${size.size} font-${size.bold}`
                        )}>{size.name}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default TextTab