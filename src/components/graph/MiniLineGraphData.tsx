import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

type MiniLineGraphDataProps = {
  title: string
  dataPoints: number[] // Assuming your data points are an array of numbers
  labels: string[] // Assuming your labels are an array of strings
}

const MiniLineGraphData: React.FC<MiniLineGraphDataProps> = ({ title, dataPoints, labels }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        borderRadius: 2,
        borderColor: '#F9B7D9',
        fill: false,
        backgroundColor: '#F9B7D9',
        data: dataPoints,
      },
    ],
  }

  const options = {
    responsive: true,
    // scales: {
    //   x: {
    //     display: true,
    //     barPercentage: 0.5,
    //     categoryPercentage: 1,
    //   },
    //   y: {
    //     display: true,
    //   },
    // },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <>
      <div className="flex flex-col justify-betwee">
        <div className="flex justify-start  py-2 px-3">
          <h5 className="text-black dark:text-gray-1 text-l font-unbounded uppercase px-3 font-light">
            {title}
          </h5>

          {/* <SwitchDisplays displayOptions={displayOptions} active={curentlyDisplayed} setActive={setCurrentDisplay} /> */}
        </div>
        <div className="px-5 py-3">
          <Line data={data} height={200} options={options} />
        </div>
      </div>
    </>
  )
}

export default MiniLineGraphData
