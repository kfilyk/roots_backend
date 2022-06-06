import React, { useState, useEffect } from 'react';
import ProgressCircle from '../common/ProgressCircle'
import axios from 'axios';

const PodCarouselTwo = (props) => {
  const [pod_list, setPodList] = useState([]);
  const [device_capacity, setNumPods] = useState(-1);

  async function fetchData(props) {
    const result = await axios.post(`/api/pods/populate_pod_carousel/`, {"id": props.experimentID});
    setPodList(result.data.pods)
    setNumPods(result.data.device_capacity)
  } 

  useEffect(() => {
    fetchData(props);
  }, []);

  function renderProgressCircle(pod){
    pod.key = "exp=" +pod.experiment + "_position=" + pod.position + "_plant=" + pod.plant_id

    if (pod.plant_id === null){
      pod.plant_name = 'Empty'
      pod.score = 0
      pod.key = "exp=" +pod.experiment + "_position=" + pod.position +"_plant=empty"
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

  function render(){
    let progress_circle_container = []
    if (device_capacity !== -1 && pod_list !== []) {
      for(let i = 0; i < device_capacity; i++) {
        let pod = pod_list.filter(pod => pod.position === (i+1))[0]
        progress_circle_container.push(renderProgressCircle(pod)) 
      }
      return <> {progress_circle_container}</> ;
    } 
    return <></>;
  };

  return (
    render()
  );
}


export default PodCarouselTwo;