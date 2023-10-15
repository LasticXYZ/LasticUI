import { FC } from 'react';
import Border from '../border/Border';

type AnalyticCardProps = {
    title: string;
    subtitle: string;
    change: number | string;
}

const getColorForChange = (change: number | string) => {
    if (typeof change === 'number') {
        return change > 0 ? 'text-green-7' : 'text-red-6';
    }
    return 'text-black';
};

const AnalyticCard: FC<AnalyticCardProps> = ({ title, subtitle, change="No info" }) => (
    <Border>
        <div className="px-8 py-5 flex flex-col items-start justify-center">
            <dt className="text-gray-15 text-sm mb-2"> { subtitle }</dt>
            <dd className="text-black font-bold text-3xl mb-1">{ title }</dd>
            <span className={`${getColorForChange(change)} text-md`}>{ change }</span>
        </div>
    </Border>
)

export default AnalyticCard;
