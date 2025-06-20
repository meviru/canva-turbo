import { useState } from "react";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";

const AITab = () => {
    const [searchValue, setSearchValue] = useState('');
    return (
        <div className="flex flex-col h-full">
            <div className="grow overflow-y-auto">AI</div>
        </div>
    )
}

export default AITab