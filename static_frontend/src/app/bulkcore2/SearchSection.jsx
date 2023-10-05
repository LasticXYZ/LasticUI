import PrimaryButton from "@/components/button/PrimaryButton";
import SearchInput from "@/components/SearchInput/SearchInput";
import SwitchDisplays from "@/components/switch/DisplaySwitch";
import { useState } from "react";

const SearchSection = ( {showMiddleButton = true}) => {
    const displayOptions = [
        { key: "24H", value: "24H" },
        { key: "7D", value: "7D" },
        { key: "30D", value: "30D" },
        { key: "infinity", value: "[infinity logo]" },
    ];

    const [curentlyDisplayed, setCurrentDisplay] = useState(displayOptions[0].key);

    return (
    <section className="mx-auto max-w-9xl flex flex-row items-center justify-between px-10">
        <div className="flex flex-row">
            &gt; Pools &gt; ETH / DAI
        </div>
        {showMiddleButton && 
        <div>
            <SwitchDisplays displayOptions={displayOptions} active={curentlyDisplayed} setActive={setCurrentDisplay} 
            className="px-6 py-2"
            />
        </div>
        }
        <div>
             <SearchInput />

        </div>
    </section>
)}

export default SearchSection;