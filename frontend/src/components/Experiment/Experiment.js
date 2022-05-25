import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import PodCarouselTwo from "./PodCarouselTwo"
import vertical_menu_icon from "../../img/vertical_menu_icon.png"

const ExperimentList = () => {
  const [experiment_list, setExperimentList] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    add: false
  })

  async function fetchData() {
    const result = await axios(
      '/api/experiments/',
    );
    setExperimentList(result.data)
  } 

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
        {experiment_list.map(item => (
          <div key={item.id} className="item">
              <div className="object_container">
                <div className="object_description">
                    <div>{ item.name }</div>
                    <div>Device Name: { item.device }</div>
                    <div>Date: {item.start_date} {"->"} {item.end_date}</div>
                    <div>Score: { item.score } </div>
                </div>
                <div className="pod_carousel_wrapper">                          
                    <PodCarouselTwo experimentID={item.id}></PodCarouselTwo>
                </div>
              </div>
          </div>
        ))}
    </div>
  );
}


export default ExperimentList;