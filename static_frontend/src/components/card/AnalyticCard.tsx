import { FC } from 'react';

type AnalyticCard = {
    title: string;
    subtitle: string;
}

const AnalyticCard: FC<AnalyticCard> = (
    { title, subtitle }
    ) => (
    <div className="px-3 py-7 flex flex-col items-center justify-center bg-white border border-gray-6 rounded-3xl">
        <dt className="mb-2 text-2xl font-bold">{ title }</dt>
        <dd className="text-gray-20 font-light text-sm">{ subtitle }</dd>
    </div>
)

export default AnalyticCard;