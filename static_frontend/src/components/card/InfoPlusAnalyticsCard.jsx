import SubAnalyticCard from "./SubAnalyticCard";

const InforPlusAnalyticsCard = () => {
    return (
        <div className="grid grid-cols-1 place-content-between w-full bg-black border border-gray-20 p-7 rounded-3xl">
            <div>
                <h3 className="text-2xl font-syncopate uppercase text-white">Total tokens locked</h3>
                <div>
                    <div className="flex flex-row justify-between items-center">
                        <div> ETH  </div>
                        <div> 15.31M </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <div> DAI  </div>
                        <div> 15.31M </div>
                    </div>
                </div>

            </div>
            <div className="grid grid-cols-2 gap-4 ">
                <SubAnalyticCard title="35.63M" subtitle="TVL" info="0.18%" />
                <SubAnalyticCard title="1.88M" subtitle="Volume 24H" info="1.97%" />
                <SubAnalyticCard title="1.03K" subtitle="Fees in 24h"/>
                <SubAnalyticCard title="🔥 689" subtitle="lastic burned" />
            </div>
        </div>
    )
}

export default InforPlusAnalyticsCard;