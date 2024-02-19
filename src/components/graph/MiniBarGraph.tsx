import { useState } from 'react'

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

const MiniBarGraph = () => {
  const displayOptions = [
    { key: 'deposit', value: 'Deposit' },
    { key: 'collateral', value: 'Collateral' },
  ]

  const [curentlyDisplayed, setCurrentDisplay] = useState(displayOptions[0].key)

  const data = {
    labels: [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
    ],
    datasets: [
      {
        borderRadius: 2,
        borderColor: '#fff',
        fill: false,
        backgroundColor: 'deposit' === curentlyDisplayed ? '#76EDDD' : '#fff',
        data: [40, 68, 8, 74, 56, 60, 7, 6, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87],
      },
    ],
  }

  const options = {
    scales: {
      x: {
        display: false,
        barPercentage: 0.5,
        categoryPercentage: 1,
      },
      y: {
        display: false,
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
          <h5 className="text-black text-l font-unbounded uppercase px-3 font-light">
            Monthly PRICE PER CORE
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

export default MiniBarGraph
