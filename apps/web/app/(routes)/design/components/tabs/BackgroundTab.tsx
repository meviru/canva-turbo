import { useState } from "react";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";

const BackgroundTab = () => {
    const [searchValue, setSearchValue] = useState('');
    return (
        <div className="flex flex-col h-full">
            <TabHeader>
                <TabSearchBox placeholder="Search backgrounds" value={searchValue} onChange={(value) => { setSearchValue(value) }} />
            </TabHeader>
            <div className="grow overflow-y-auto"></div>
        </div>
    )
}

export default BackgroundTab