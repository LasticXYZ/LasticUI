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
  xLabel?: string
  yLabel?: string
}

const MiniLineGraphData: React.FC<MiniLineGraphDataProps> = ({
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
        borderColor: '#F9B7D9',
        fill: false,
        backgroundColor: '#F9B7D9',
        data: dataPoints,
      },
    ],
  }

  const options = {
    responsive: true,
    scales: {
      x: {
        display: true,
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
          <Line data={data} height={200} options={options} />
        </div>
      </div>
    </>
  )
}

export default MiniLineGraphData
