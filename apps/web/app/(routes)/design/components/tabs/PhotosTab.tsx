import { useState } from "react";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";

const PhotosTab = () => {
    const [searchValue, setSearchValue] = useState('');
    return (
        <div className="flex flex-col h-full">
            <TabHeader>
                <TabSearchBox placeholder="Search photos" value={searchValue} onChange={(value) => { setSearchValue(value) }} />
            </TabHeader>
            <div className="grow overflow-y-auto"></div>
        </div>
    )
}

export default PhotosTab