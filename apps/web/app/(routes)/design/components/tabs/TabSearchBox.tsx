import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconSearch, IconX } from '@tabler/icons-react';

interface TabSearchBoxProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

const TabSearchBox = ({
    placeholder = "Search...",
    value,
    onChange,
}: TabSearchBoxProps) => {
    return (
        <div className="relative w-full mb-3">
            <IconSearch
                size={22}
                className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-500 dark:text-zinc-300"
            />
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-10 pr-10 py-2 w-full text-sm rounded-md bg-zinc-100 dark:bg-zinc-900 text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-zinc-400 focus:outline-none"
            />
            {value.length > 0 && (
                <Button
                    size="icon"
                    variant="ghost"
                    className="cursor-pointer absolute size-8 right-1.5 top-1/2 -translate-y-1/2 text-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-800"
                    onClick={() => onChange('')}
                >
                    <IconX className="size-4 p-[2px] rounded-full bg-gray-500" />
                </Button>
            )}
        </div>
    );
};

export default TabSearchBox