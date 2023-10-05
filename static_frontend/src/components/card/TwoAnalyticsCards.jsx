import SubAnalyticCard from "./SubAnalyticCard";

const TwoAnalyticsCards = () => {
    return (
        <div className="grid grid-cols-1 place-content-between w-full bg-black border border-gray-20 p-7 rounded-3xl">
            <div className="grid grid-cols-2 gap-4 ">
                <SubAnalyticCard title="35.63M" subtitle="TVL" info="0.18%" />
                <SubAnalyticCard title="1.88M" subtitle="Volume 24H" info="1.97%" />
                <SubAnalyticCard title="1.03K" subtitle="Fees in 24h"/>
                <SubAnalyticCard title="🔥 689" subtitle="lastic burned" />
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

export default TwoAnalyticsCards;