import InfoPlusAnalyticsCard from "@/components/card/InfoPlusAnalyticsCard"
import TwoAnalyticsCards from "@/components/card/TwoAnalyticsCards"
import MainBarGraph from "@/components/graph/MainBarGraph"

const GraphSection = () => (
    <section className="mx-auto max-w-9xl p-10">
    <div className="grid grid-cols-3 gap-4 ">
        <div className="col-span-2">
            <MainBarGraph />
        </div>
        <div className=" flex items-stretch">
            <InfoPlusAnalyticsCard />
        </div>
    </div>
    </section>
)


export default GraphSection