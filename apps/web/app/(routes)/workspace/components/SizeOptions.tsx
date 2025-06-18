import { getContrastColor } from "@/lib/utils";
import { canvasSizeOptions } from "../constants"
import { IconFrame } from "@tabler/icons-react";

const SizeOptions = () => {
    const onCanvasOptionSelect = (option: any) => {
        console.log(option);
    }

    return (
        <ul className="flex my-8 pb-4 gap-5 items-start justify-center">
            {canvasSizeOptions.map((option, i) => (
                <li
                    key={i}
                    className="group flex flex-col items-center justify-center cursor-pointer"
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
                    <h2 className="text-xs text-gray-600 text-center font-medium mt-2 mb-1 max-w-20">
                        {option.name}
                    </h2>
                    <span className="text-xs font-medium opacity-0 scale-[0.9] text-gray-400 transition-opacity group-hover:opacity-100">
                        {option.width} x {option.height}px
                    </span>
                </li>
            ))}
            <li className="group flex flex-col items-center justify-center cursor-pointer">
                <div
                    className="size-12 flex items-center justify-center bg-[#f2f3f5] text-gray-900 rounded-full transition-transform group-hover:scale-[1.05]">
                    <IconFrame />
                </div>
                <h2 className="text-xs text-gray-600 text-center font-medium mt-2 mb-1 max-w-20">Custom size</h2>
                <span className="text-xs font-medium opacity-0 scale-[0.9] text-gray-400 transition-opacity group-hover:opacity-100">
                    Create new
                </span>
            </li>
        </ul>
    )
}

export default SizeOptions