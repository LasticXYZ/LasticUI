import React, { useState } from "react";

import { Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
 } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

const MainBarGraph = () => {
    const displayOptions = [
        { key: "volume", value: "Volume" },
        { key: "liquidity", value: "Liquidity" },
        { key: "fee", value: "Fees"}
      ];
    
    const [curentlyDisplayed, setCurrentDisplay] = useState(displayOptions[0].key);

    const data = {
        labels: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25",
            "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
            "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75",
            "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100",
            "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125",
            "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150",
        ],
        datasets: [
            {
                borderRadius: 20,
                fill: false,
                backgroundColor: "volume" === curentlyDisplayed ? "#81c7db" : "#fff",
                data: [ 40, 68, 8, 74, 56, 60, 7, 6, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87,  40, 68, 86, 74, 56, 6, 8, 56, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87,  40, 68, 86, 4, 5, 6, 87, 56, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87, 40, 68, 86, 74, 6, 0, 87, 56, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87,  40, 68, 86, 74, 6, 6, 7, 56, 60, 7, 60, 87, 6, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87, 40, 68, 86, 74, 56, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87, 60, 87, 56, 60, 87, ],
            },
        ],
    };

    const options = {
      plugins: {
        legend: {
            display: false
        },
        elements: {
            bar: {
                barPercentage: 0.5,
                categoryPercentage: 1,
            },
        },
        scales: {
            xAxis: { display: true /* this is redundent */ },
            yAxis: { display: true /* this is redundent */ },  
        },
      },
    };

    return (
        <>
        <div className="flex flex-col justify-between bg-white border border-gray-7 shadow p-6 rounded-xl">
            <div className="flex justify-between py-2 px-3">
                <h5 className="text-black text-xl font-syncopate px-3 font-light">Insta coretime Price over time</h5>
                {/* <SwitchDisplays displayOptions={displayOptions} active={curentlyDisplayed} setActive={setCurrentDisplay} /> */}
            </div>
            <div className="px-5 py-3">
                <Bar data={data} height={200} options={options} />
            </div>
        </div>
        </>
    )

}

export default MainBarGraph;