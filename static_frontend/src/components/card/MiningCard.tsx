import PrimaryButton from "../button/SecondaryButton";
import CryptoIcon from "../icon/CryptoIcon";
import TagComp from "../tags/TagComp";

const MiningCard = () => (
<div className=" m-4 p-8 bg-gray-23 flex flex-col items-center rounded-3xl shadow dark:bg-gray-800 dark:border-gray-700">
    <div className="flex justify-between items-center py-3">
        <div className=" flex justify-normal items-center px-5">
            <CryptoIcon address="" name="DAI" size={50}/>
        </div>
        <h5 className="text-2xl font-syncopate font-bold tracking-tight text-gray-900 dark:text-white">
            ETH / DAI
        </h5>
        <a
        href="#"
        className="font-rubik flex justify-normal items-center px-5 text-4xl"
        >
            <div className="rounded-full p-0.5 mx-1 bg-white" />
            <div className="rounded-full p-0.5 mx-1 bg-white" />
            <div className="rounded-full p-0.5 mx-1 bg-white" />
        </a>
    </div>
    <div className="flex-auto py-3">
        <div className="flex justify-between items-center">
            <div className="text-center flex flex-col items-center">
                <div className="text-4xl font-bold">1.0</div>
                <div className="flex py-3 justify-normal items-center">
                    <div className="text-gray-10 font-bold">ETH</div>
                    <TagComp className="mx-2" title="Collateral"/>
                </div>
            </div>
            <div className="text-center text-5xl px-5">
                /
            </div>
            <div className="text-center flex flex-col items-center">
                <div className="text-4xl font-bold">1,235.29</div>
                <div className="flex py-3 justify-normal items-center">
                    <div className="text-gray-10 mx-2 font-bold">DAI</div>
                    <TagComp className="mx-2" title="Quote"/>
                </div>
            </div>
        </div>
    </div>
    <div className="flex-auto py-3">
        <hr className="text-gray-10"/>
    </div>
    <div className="flex-auto py-3">
        <div className="flex justify-between py-3">
            <p className="text-gray-10">Total value locked</p>
            <p>$1,000,000.00</p>
        </div>
        <div className="flex justify-between py-3">
            <p className="text-gray-10">APR</p>
            <p>2.70%</p>
        </div>
        <div className="flex justify-between py-3">
            <p className="text-gray-10">lastic Burned in Auction</p>
            <p className="text-right">957 🔥</p>
        </div>
    </div>
    <div className="flex-auto py-3">
        <PrimaryButton title="Pool Details ->" location="/pools/ETH-DAI" />
    </div>
</div>
)

export default MiningCard;