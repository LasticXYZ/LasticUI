import { FC } from 'react'

type TagCompProps = {
  title: string
  className?: string
  color?: string
}

const TagComp: FC<TagCompProps> = ({
  title,
  className,
  color = 'bg-pink-400 dark:bg-pink-400',
}) => {
  return (
    <div
      className={`${className} ${color} dark:bg-opacity-80 border border-gray-8 px-4 py-1 text-xs font-semibold uppercase rounded-full shadow-lg`}
    >
      {title}
    </div>
  )
}
export default TagComp
