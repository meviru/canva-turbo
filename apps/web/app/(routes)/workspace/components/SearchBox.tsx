import { IconArrowRight, IconSearch } from "@tabler/icons-react"

const SearchBox = () => {
    return (
        <div className="mx-auto mt-10 mb-16 flex max-w-3xl items-center justify-center">
            <div className="w-full relative rounded-3xl bg-gradient-to-r from-sky-400 via-violet-400 to-violet-700 p-[1px] transition-all
                    shadow-none
                    hover:shadow-[0_10px_15px_rgba(139,92,246,0.5)]
                    focus-within:shadow-[0_10px_15px_rgba(139,92,246,0.5)]
                    dark:hover:shadow-[0_10px_15px_rgba(139,92,246,0.6)]
                    dark:focus-within:shadow-[0_10px_15px_rgba(139,92,246,0.6)]">
                <IconSearch
                    size={22}
                    className="absolute top-1/2 left-5 opacity-40 -translate-y-1/2 text-black dark:text-white"
                />
                <input
                    type="text"
                    placeholder="Search millions of templates"
                    className="outline-0 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 p-2 px-13 w-full text-sm h-[75px] rounded-[22px]"
                />
                <button className="absolute top-1/2 right-4 size-8 rounded-full bg-gray-200 dark:bg-zinc-700 cursor-pointer grid place-items-center -translate-y-1/2">
                    <IconArrowRight size={20} className="opacity-70 text-black dark:text-white" />
                </button>
            </div>
        </div>
    );
};

export default SearchBox