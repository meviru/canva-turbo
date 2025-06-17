import Heading from "./components/Heading";
import RecentDesigns from "./components/RecentDesigns";
import SearchBox from "./components/SearchBox";
import SizeOptions from "./components/SizeOptions";

const Workspace = () => {
    return (
        <div className="px-6 py-8 relative bg-white z-10 min-h-60 h-full border shadow rounded-2xl rounded-bl-none rounded-br-none">
            <Heading />
            <SearchBox />
            <SizeOptions />
            <RecentDesigns />
        </div>
    );
};

export default Workspace;
