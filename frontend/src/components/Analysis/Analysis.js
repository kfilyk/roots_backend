import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import menu_icon from "../../img/menu_icon.png";
import 'chart.js/auto'
//import {Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js";
import {Bar, Line, Scatter} from 'react-chartjs-2';

//ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);

const Analysis = () => {
  const [erList, setExperimentReadingList] = useState([]);
  const [prList, setPodReadingList] = useState([]);

  /* this probably doesnt work when making a real stats dashboard since it needs to be dynamic */
  /* for germination count bar graph */
  const [germinationCount, setGerminationCount] = useState([]);
  const [labels, setLabels] = useState([]);
  const [dome, setDome] = useState([]);
  const [dates, setDates] = useState([]);
  const [podData, setPodData] = useState([]);
  const [heightData, setHeightData] = useState([]);

  

  /*const germinationCount = pr_list.map(a => a.germination_rate);
  const labels = pr_list.map(b => b.id);
*/

  /* test graph 1 */
  const [barData, setBarData] = useState({
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }]
  })
  

  
  // LOOK IN "urls.py":  /api/plants/, /api/pods/, etc...
  async function fetchExperimentReadings() {
    const result = await axios(
      '/api/experimentreadings/',
    );

    setExperimentReadingList(result.data)
  };

  async function fetchPodReadings() {
    const result = await axios(
      '/api/podreadings/',
    );

    setPodReadingList(result.data)
  };

  async function fetchAllPodData(id) {
    const result = await axios.post('/api/pods/get_all_pod_data/', {"id":id});
    setPodData(result.data)
  }

  /* Trying to get the last height measurement */
  async function getAllGraphData() {
    const maxHeight = podData['pods'][1]

    setHeightData(maxHeight)
  }

  async function getGerminationCount() {
    const result = prList.map(a => a.germination_rate);
    const labels = prList.map(b => b.id);
    setGerminationCount(result)
    setLabels(labels);
  };
  
  async function getDomeRemoval() {
    const result = prList.map(a => Number(a.removed_dome));
    const labels = prList.map(b => b.reading_date.split('T')[0]);
    setDome(result);
    setDates(labels);
  }

//  async function 

  /* [] : indicates that this runs ONCE at the start of render */
  /* Retrieves all the experiment/pod readings*/
  useEffect(() => {
    fetchExperimentReadings();
    fetchPodReadings();
    fetchAllPodData(80);
  }, []);

  useEffect(() => {
    getGerminationCount();
    getDomeRemoval();
  }, [prList]);

  const germData = {
    labels,
    datasets: [{
      label: 'Germination Rate',
      data: germinationCount,
      borderWidth: 2,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
        ],

    }]
  };


/*Test data to make any line graph render*/
const lineDataTest = [1,2,3,4,5,6]
const lineData = {
  labels:['one','two','three','four','five','six'],
  datasets: [
    {
      label:'test data',
      data: lineDataTest
    }
  ]
}

const domeData = {
  labels: dates,
  datasets: [
    {
      label: 'Dome Removal',
      data: dome,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
    }
  ]
}
  return (

    <div>
      {JSON.stringify(heightData)}
    <h3>Experiment ID: 80</h3>
    {JSON.stringify(podData)}
    <h1>@@@@@@@</h1>

    {JSON.stringify(erList)}
    <h1>#######</h1>
    {JSON.stringify(prList)}

    <Line data={domeData}
    options={{
      scales:{
        x:{
          title: {
            display: true,
            text: 'Date of Pod Reading',
            font: {
              size: 20
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Removed Dome',
            font: {
              size: 20
            }
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Dome Removal vs Pod Reading',
          font: {
            size: 30
          }
        },
        legend: {
          display: false
        }
      }
    }}/>
      



      <h1>@Functioning Bar Graph@</h1>
      <Bar data={germData} 
      options={{
        scales: {
          xAxes: {
            title: {
              display: true,
              text: 'Pod Reading ID',
              font: {
                size: 20
              }
            }
          },
          yAxes: {
            title: {
              display: true,
              text: 'Germination Rate',
              font: {
                size: 20
              }
            }
          }
        },
          plugins: {
            title: {
              display: true,
              text: 'test title text',
              font: {
                size: 30
              }
            },
            legend: {
              display: false
            }
          },
      }}/>
    </div>
    /*<div>
      <Bar data={barData}/>

      <Line data={lineData}/>

      {JSON.stringify(germinationCount)};
      {JSON.stringify(labels)};
      {JSON.stringify(dome)};
      {JSON.stringify(dates)};

    </div>
    */
  );
}


export default Analysis;