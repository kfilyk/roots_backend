import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./pod_carousel.css";

const PodCarousel = (props) => {
  //List of pods for a particular exp
  const [podList, setPodList] = useState([]);
  //Capacity of device for a particular exp
  const [capacity, setCapacity] = useState(-1);

  /*
  Input from: props.experimentID
  Outputs to: podList, capacity
  Created by: Kelvin F 08/31/2022
  Last Edit: Kelvin F 08/31/2022
  Purpose: Given an experiment id, retrieves its device's capacity and info about its pods including plant name
  */
  async function fetchData(id) {
    const result = await axios.post(`/api/pods/populate_pod_carousel/`, {"id":id});
    setPodList(result.data.pods)
    setCapacity(result.data.capacity)
  } 

  /*
  Input from: None
  Outputs to: fetchData()
  Created by: Kelvin F 08/31/2022
  Last Edit: Kelvin F 08/31/2022
  Purpose: Upon page load, grabs the device capacity and pods for a particular experiment
  */
  useEffect(() => {
    fetchData(props?.experimentID);
  }, [props?.experimentID]);

  /*
  Input from: podList
  Outputs to: render()
  Created by: Stella T 08/31/2022
  Last Edit: Stella T 08/31/2022
  Purpose: Renders the progress circle for a plant, the colour of the wheel changes based on plant's score.
  */
  function renderProgressCircle(pod, pos){
    //console.log(pod)
    if (pod === null || pod.end_date !== null) {
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

    return (
      //https://codepen.io/sergiopedercini/pen/jmKdbj
      <div key={pod.key} className="single-chart">
          <svg viewBox="0 0 36 36" className={'circular-chart ' + pod.colour}>
            <path className="circle-bg"
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
                <text x="18" y="18" className="caption"> {pod.plant_name}</text>
                <text x="18" y="24" className="percentage"> {pod.score * 100 + "%"}</text>
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
  Purpose: Based on the capacity, renders a collection of progress circles (each presents a different pod)
  */
  function render(){
    let progress_circle_container = []
    if (capacity !== -1) { // if pod list is straight up empty, we still need to render 5 "empty" pods
      for(let i = 0; i < capacity; i++) {
        let pod = podList.filter(pod => pod.position === (i+1))[0] ?? null;      
        let pos = i+1  
        progress_circle_container.push(renderProgressCircle(pod, pos)) 
      }
      return <> {progress_circle_container}</> ;
    } 
    return <></>;
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