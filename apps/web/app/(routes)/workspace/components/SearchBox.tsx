import { IconArrowRight, IconSearch } from "@tabler/icons-react"

const SearchBox = () => {
    return (
        <div className="mx-auto mt-10 mb-16 flex max-w-3xl items-center justify-center">
            <div className="w-full relative rounded-3xl shadow-lg shadow-violet-500/20 bg-gradient-to-r transition-all from-sky-400 via-violet-400 to-violet-700 p-[1px] hover:shadow-violet-500/50 focus-within:shadow-violet-500/50">
                <IconSearch
                    size={22}
                    className="absolute top-1/2 left-5 opacity-40 -translate-y-1/2"
                />
                <input
                    type="text"
                    placeholder="Search millions of templates"
                    className="outline-0 bg-white p-2 px-13 w-full text-sm h-[75px] rounded-[22px]"
                />
                <button className="absolute top-1/2 right-4 size-8 rounded-full bg-gray-200 cursor-pointer grid place-items-center -translate-y-1/2">
                    <IconArrowRight size={20} className="opacity-70 w-full" />
                </button>
            </div>
        </div>
    )
}

export default SearchBox