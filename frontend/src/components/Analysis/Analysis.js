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
  const [podData, setPodData] = useState([]);
  const [plantData, setPlantData] = useState([]);
  const [recipeList, setRecipeList] = useState([]);

  /* this probably doesnt work when making a real stats dashboard since it needs to be dynamic */
  /* for germination count bar graph */
  const [germinationCount, setGerminationCount] = useState([]);
  const [labels, setLabels] = useState([]);
  const [dome, setDome] = useState([]);
  const [dates, setDates] = useState([]);

  const [heightData, setHeightData] = useState([]);
  const [experimentData, setExperimentData] = useState([]);
  const [plantSpecies, setPlantSpecies] = useState([]);
  const [plantID, setPlantID] = useState([]);
  
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

  async function fetchRecipe() {
    const result = await axios(
      '/api/recipes/',
    )
      setRecipeList(result.data)
  }

  async function fetchAllPodData(id) {
    const result = await axios.post('/api/pods/get_all_pod_data/', {"id":id});
    setPodData(result.data)
  }

  /* [] : indicates that this runs ONCE at the start of render */
  /* Retrieves all the experiment/pod readings*/
  useEffect(() => {
    fetchExperimentReadings();
    fetchPodReadings();
    fetchAllPodData(80);
    fetchExperiments();
    fetchPlant();
    fetchRecipe();
  }, []);

  /* This runs every time prList, erList, plantData, podData changes */
  useEffect(() => {
    getGerminationCount();
    getPlantSpeciesID(plantData);
    //getDomeRemoval();
    //getAllGraphData();
  }, [prList, erList, plantData, podData]);

  
  /* Trying to get the last height measurement */
  /*
  async function getAllGraphData() {
    const maxHeight = podData.pods[0].reading.at(-1)//[1]//['reading'][-1]

    setHeightData(maxHeight)
  }
  */
  async function getGerminationCount() {
    const result = prList.map(a => a.germination_rate);
    const labels = prList.map(b => b.id);
    setGerminationCount(result)
    setLabels(labels);
  };
  /*
  async function getDomeRemoval() {
    const result = prList.map(a => Number(a.removed_dome));
    const labels = prList.map(b => b.reading_date.split('T')[0]);
    setDome(result);
    setDates(labels);
  }
  */ 

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

//Get plant type species
//maybe append species and ID as a dictionary to a list or something
async function getPlantSpeciesID(plant) {
  const plantList = [];
  const id = [];
  for (let i = 0; i < plant.length; i++) {
    var plantDict = {};
    plantDict['species'] = plant[i]['species'];
    plantDict['id'] = plant[i]['id'];
    plantList.push(plantDict);
    //id.push(plant[i]['id'])
  }
  //To get unique/non null values and sort alphabetically
  setPlantSpecies([...new Set(plantList/*.sort().filter(Boolean)*/)])
  //setPlantID([...new Set(id.sort().filter(Boolean))])
}

/* set plant buttons, no functionality rn */

// function plantButtons() {
//   let buttons = [];
//   for (let i = 0; i < plantSpecies.length; i++) {
//     buttons.push(<button /*onClick={plantGrabExpReadings(plantSpecies[i])}*/>
//       {plantSpecies[i]}</button>)
//   }
//   return buttons;
// }

/* Set recipe buttons, no functionality rn */
function recipeButtons() {
  let buttons = [];
  for (let i=0; i<recipeList.length; i++) {
    buttons.push(<button>{recipeList[i]['name']}</button>)
  }
  return buttons;
}

/* Experiment_reading tracks experiment_id which we can connect through pod_reading,
 pod_reading notes the pod_id which connects to pod table. pod table has the plant id.
 So maybe each button has its plant id attached to it and form there we can create the filter*/
/* onclick of the button, filter experiment readings based on the plant type selected*/
function plantGrabExpReadings(plant) {
 /*TODO*/
  //for (let i=0; i < )
}

/* Pod readings is similarly to experiment reading but without accessing experiment reading table */
/* onclick of the button, filter pod readings based on the plant type selected*/
function plantGrabPodReadings(plant) {
  /*TODO*/
 
 }

 /* Each experiment has the recipe it is running on in the experiment tab under recipe_id. 
 maybe each button will have the recipes id attached to the button and from there the
 recipe can be filtered for through the recipe_id */
 /* onclick of the button, filter pod readings based on the recipe type selected*/
  function recipeGrabPodReadings(plant) {
  /*TODO*/
 
 }

 /* onclick of the button, filter pod readings based on the recipe type selected*/
function recipeGrabPodReadings(plant) {
  /*TODO*/
 
 }

/*@@@@@@@@@@@@@@*/
  return (

    <div className='darryl-class'>
      <h4>testtest</h4>
      plantButtons()
      {JSON.stringify(plantSpecies)}
      <h5>recipe buttons</h5>
      {recipeButtons()}
      {JSON.stringify(recipeList)}
      <h3>Plant Data</h3>
      
      {JSON.stringify(plantData)}
      <h3>Experiment Data</h3>
      {JSON.stringify(experimentData)}

<h1>graphs</h1>
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