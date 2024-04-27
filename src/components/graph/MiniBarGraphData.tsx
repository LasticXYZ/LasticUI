import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

type MiniBarGraphDataProps = {
  title: string
  dataPoints: number[]
  labels: string[]
  xLabel?: string
  yLabel?: string
}

const MiniBarGraphData: React.FC<MiniBarGraphDataProps> = ({
  title,
  dataPoints,
  labels,
  xLabel = '',
  yLabel = '',
}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        borderRadius: 2,
        borderColor: '#fff',
        fill: false,
        backgroundColor: '#F9B7D9',
        data: dataPoints,
      },
    ],
  }

  const options = {
    scales: {
      x: {
        display: true,
        barPercentage: 0.5,
        categoryPercentage: 1,
        title: {
          display: xLabel ? true : false,
          text: xLabel, // Modify this text based on what you're actually displaying
          color: '#666', // Optional: change the color of the y-axis label
          font: {
            size: 18,
            family: 'Arial', // Optional: set the font type for the y-axis title
          },
        },
      },
      y: {
        display: true,
        title: {
          display: yLabel ? true : false,
          text: yLabel, // Modify this text based on what you're actually displaying
          color: '#666', // Optional: change the color of the y-axis label
          font: {
            size: 18,
            family: 'Arial', // Optional: set the font type for the y-axis title
          },
        },
      },
    },
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
          <Bar data={data} height={200} options={options} />
        </div>
      </div>
    </>
  )
}

export default MiniBarGraphData
