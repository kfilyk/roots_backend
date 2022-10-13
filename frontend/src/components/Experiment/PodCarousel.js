import React, { useState, useEffect } from 'react';
import "./pod_carousel.css";

const PodCarousel = (props) => {
  //List of pods for a particular exp

  /*
  Input from: podList
  Outputs to: render()
  Created by: Stella T 08/31/2022
  Last Edit: Stella T 08/31/2022
  Purpose: Renders the progress circle for a plant, the colour of the wheel changes based on plant's score.
  */
  function renderProgressCircle(pod, pos){
    if (pod === null) {
      pod = {'plant_name': 'Empty', 'score': 0, 'key': "empty_pod_"+pos} 
    } else {
      pod.key = "exp=" +pod.experiment + "_position=" + pod.position + "_plant=" + pod.plant_id
    }

    switch(true) {
      case pod.score >= 0.8:
        pod.colour = 'green'
        break;
      case pod.score >= 0.6:
        pod.colour = 'yellow'
        break;
      case pod.score >= 0.4:
        pod.colour = 'orange'
        break;
      default:
        pod.colour = 'red'
        break;
    }

    let plant_name_split = pod.plant_name.split(" ")
    plant_name_split = plant_name_split.map(p => p+" ");

    let plant_name_split_length = plant_name_split.length

    return (
      //https://codepen.io/sergiopedercini/pen/jmKdbj

      <div key={pod.key} className="single-chart">
          <svg viewBox="0 0 36 36" className={'circular-chart ' + pod.colour} onClick={e => { 
              e.stopPropagation();
              props.selectedPod === pod.id ?  props.setSelectedPod(-1) : props.setSelectedPod(pod.id || -1);
              if(props.selectedExperiment !== props.experimentID) props.setSelectedExperimentReading(-1);
              props.setSelectedExperiment(props.experimentID)

            }}>
            <path className={(props.selectedPod === pod.id) ? "circle-bg-selected" : "circle-bg"}
                d="M18 2.0845
                a 16 16 0 0 1 0 32
                a 16 16 0 0 1 0 -32"
                
            />
            <path className="circle"
                strokeDasharray={pod.score * 100 + ' 100'}
                d="M18 2.0845
                a 16 16 0 0 1 0 32
                a 16 16 0 0 1 0 -32"
            />
            { pod.score === 0 ?
                <text x="18" y="20" className="caption"> {pod.plant_name}</text>
            : 
            <>
                <text x="18" y="14" className="caption"> {plant_name_split.slice(0, plant_name_split_length/2)}</text>
                <text x="18" y="20" className="caption"> {plant_name_split.slice(plant_name_split_length/2, plant_name_split_length)}</text>
                <text x="18" y="26" className="percentage"> {pod.id}</text>

                {/*<text x="18" y="26" className="percentage"> {pod.score * 100 + "%"}</text>*/}
            </> 
            }

          </svg>
      </div>
  )
  }

  /*
  Input from: renderProgressCircle
  Outputs to: return()
  Created by: Stella T 08/29/2022
  Last Edit: Stella T 08/29/2022
  Purpose: Renders a collection of progress circles (each presents a different pod)
  */
  function render(){
    let progress_circle_container = []
    for(let i = 0; i < 5; i++) {
      let pod = props.podList.filter(pod => pod.position === (i+1))[0] ?? null;      
      let pos = i+1  
      progress_circle_container.push(renderProgressCircle(pod, pos)) 
    }
    return <> {progress_circle_container}</> ;
  };

  /*
  Input from: render()
  Outputs to: Screen
  Created by: Stella T 08/29/2022
  Last Edit: Stella T 08/29/2022
  Purpose: The container rendering all the components on the page. 
  */
  return (
    render()
  );
}


export default PodCarousel;