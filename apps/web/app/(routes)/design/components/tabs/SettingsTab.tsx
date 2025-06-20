import { useState } from "react";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";

const SettingsTab = () => {
    const [searchValue, setSearchValue] = useState('');
    return (
        <div className="flex flex-col h-full">
            <div className="grow overflow-y-auto">Settings</div>
        </div>
    )
}

export default SettingsTab