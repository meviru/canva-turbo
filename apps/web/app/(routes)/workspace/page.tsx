import Heading from "./components/Heading";
import RecentDesigns from "./components/RecentDesigns";
import SearchBox from "./components/SearchBox";
import SizeOptions from "./components/SizeOptions";

const Workspace = () => {
    return (
        <div className="px-6 py-8 relative z-10 min-h-60 h-full border border-b-0 shadow rounded-2xl rounded-bl-none rounded-br-none bg-white dark:bg-[#18191b] border-zinc-200 dark:border-white/10">
            <Heading />
            <SearchBox />
            <SizeOptions />
            <RecentDesigns />
        </div>
    );
};

export default Workspace;
