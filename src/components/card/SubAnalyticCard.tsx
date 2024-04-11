import { FC } from 'react'

type SubAnalyticCardProps = {
  title: string
  subtitle: string
  info?: string
}

const SubAnalyticCard: FC<SubAnalyticCardProps> = ({ title, subtitle, info }) => (
  <div className="px-10 py-7 h-40 text-left  flex flex-col justify-center items-start bg-gray-22 rounded-3xl">
    <div className="text-l uppercase font-bold text-gray-7">{subtitle}</div>
    <div className="mb-2 text-3xl font-light">{title}</div>
    {info && <div className="">{info}</div>}
  </div>
)

export default SubAnalyticCard
