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
import React from 'react'
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

interface BarGraphProps {
  auctionIndices: string[]
  dotAmounts: number[]
}

const BarGraph: React.FC<BarGraphProps> = ({ auctionIndices, dotAmounts }) => {
  const options = {
    scales: {
      x: {
        display: true, // Enable the display of X-axis labels
        barPercentage: 0.5,
        categoryPercentage: 1,
      },
      y: {
        display: true, // Enable the display of Y-axis labels
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const data = {
    labels: auctionIndices, // Use auction indices for X-axis labels
    datasets: [
      {
        borderRadius: 2,
        borderColor: '#fff',
        fill: false,
        backgroundColor: '#76EDDD',
        data: dotAmounts, // Use DOT amounts for Y-axis values
      },
    ],
  }

  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-start py-2 px-3">
        <h5 className="text-black text-l font-unbounded uppercase px-3 font-light">Monthly PRICE PER CORE</h5>
      </div>
      <div className="px-5 py-3">
        <Bar data={data} height={200} options={options} />
      </div>
    </div>
  )
}

export default BarGraph
