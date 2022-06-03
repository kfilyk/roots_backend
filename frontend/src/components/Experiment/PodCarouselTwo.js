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

  function render(){
    let progress_circle_container = []
    if (device_capacity !== -1 && pod_list !== null) {
      for(let i = 0; i < device_capacity; i++) {
        let pod = pod_list.filter(pod => pod.position === (i+1))[0] ?? null
        if(pod !== null) {
          progress_circle_container.push(<ProgressCircle key={"pod_"+pod.position+"_"+pod.experiment+"_"+pod.plant} progress={{value: pod.score, caption: pod.plant_name, colour: 'green'}}></ProgressCircle>) 
        } else {
          progress_circle_container.push(<ProgressCircle key={"pod_"+(i+1)+"_empty"} progress={{value: 0, caption: "empty", colour: 'grey'}}></ProgressCircle>) 
        }
      }
      return <> {progress_circle_container }</> ;
    } 
    return <></>;
  };

  return (
    render()
  );
}


export default PodCarouselTwo;