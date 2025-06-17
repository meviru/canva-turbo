import Heading from "./components/Heading";
import SearchBox from "./components/SearchBox";

const Workspace = () => {
    return (
        <div className="px-6 py-8 relative min-h-60 h-full border rounded-2xl rounded-bl-none rounded-br-none">
            <Heading />
            <SearchBox />
        </div>
    );
};

export default Workspace;
