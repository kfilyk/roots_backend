import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import menu_icon from "../../img/menu_icon.png";
import 'chart.js/auto'
import {Bar, Line, Scatter} from 'react-chartjs-2';
import './analysis.css';

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
  const [experimentData, setExperimentData] = useState([]);
  const [plantData, setPlantData] = useState([]);
  const [speciesData, setSpeciesData] = useState([]);
  
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

  /*  */
  async function fetchExperiments() {
    const result = await axios(
      '/api/experiments/',
    );

      setExperimentData(result.data)
  };

  async function fetchPlant() {
    const result = await axios(
      '/api/plants/',
    );
      setPlantData(result.data)
  }

  async function fetchAllPodData(id) {
    const result = await axios.post('/api/pods/get_all_pod_data/', {"id":id});
    setPodData(result.data)
  }

  /* Trying to get the last height measurement */
  async function getAllGraphData() {
    const maxHeight = podData.pods[0].reading.at(-1)//[1]//['reading'][-1]

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
    fetchExperiments()
    fetchPlant()
    getPlantSpecies(plantData)
  }, []);

  useEffect(() => {
    getGerminationCount();
    getDomeRemoval();
    getAllGraphData();
  }, [prList, podData]);

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

async function getPlantSpecies(plant) {
  const species = []
  for (let i = 0; i < plant.length(); i++) {
    species.push(plant[i]['species']);
  }
  setSpeciesData(species)
}

/*@@@@@@@@@@@@@@*/
  return (

    <div className='darryl-class'>
      <h4>testtest
      </h4>
      {JSON.stringify(speciesData)}
      {JSON.stringify(plantData[0]['species'])}
      <h3>Plant Data</h3>
      
      {JSON.stringify(plantData)}

      <h3>Experiment Data</h3>
      {JSON.stringify(experimentData)}

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
    
    <h1>@@@@@@@</h1>

    {JSON.stringify(erList)}
    <h1>#######</h1>
    {JSON.stringify(prList)}
      {JSON.stringify(germinationCount)};
      {JSON.stringify(labels)};
      {JSON.stringify(dome)};
      {JSON.stringify(dates)};

    </div>
    */
  );
}


export default Analysis;