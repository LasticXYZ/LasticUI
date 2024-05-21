import { FC } from 'react'

interface CountDownProps {
  title: string
  timeRemaining: string
}

const CountDown: FC<CountDownProps> = ({ title, timeRemaining }) => {
  return (
    <div>
      <div className="flex justify-between rounded-full mx-10 bg-pink-300 dark:bg-pink-400 dark:bg-opacity-95  px-16 py-10 bg-opacity-30 items-center my-6">
        <div className="text-xl xl:text-2xl font-bold font-unbounded uppercase text-gray-21 dark:text-white ">
          {title}
        </div>
        <div className="text-xl xl:text-2xl font-bold font-unbounded uppercase text-gray-18 dark:text-white ">
          {timeRemaining}
        </div>
      </div>
    </div>
  )
}

export default CountDown
