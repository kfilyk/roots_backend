import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./pod_carousel.css";

const PodCarousel = (props) => {
  const [pod_list, setPodList] = useState([]);
  const [capacity, setCapacity] = useState(-1);

  async function fetchData(props) {
    const result = await axios.post(`/api/pods/populate_pod_carousel/`, {"id": props.experimentID});
    setPodList(result.data.pods)
    setCapacity(result.data.capacity)
  } 

  useEffect(() => {
    fetchData(props);
  }, [props]);

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

  function render(){
    let progress_circle_container = []
    if (capacity !== -1) { // if pod list is straight up empty, we still need to render 5 "empty" pods
      for(let i = 0; i < capacity; i++) {
        let pod = pod_list.filter(pod => pod.position === (i+1))[0] ?? null;      
        let pos = i+1  
        progress_circle_container.push(renderProgressCircle(pod, pos)) 
      }
      return <> {progress_circle_container}</> ;
    } 
    return <></>;
  };

  return (
    render()
  );
}


export default PodCarousel;