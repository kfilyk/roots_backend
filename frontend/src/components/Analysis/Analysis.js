import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import menu_icon from "../../img/menu_icon.png"

const Analysis = () => {
  const [erList, setExperimentReadingList] = useState([]);
  const [prList, setPodReadingList] = useState([]);
  const [podData, setPodData] = useState([]);


  // LOOK IN "urls.py":  /api/plants/, /api/pods/, etc...
  async function fetchExperimentReadings() {
    const result = await axios(
      '/api/experimentreadings/',
    );

    setExperimentReadingList(result.data)
  } 

  async function fetchPodReadings() {
    const result = await axios(
      '/api/podreadings/',
    );

    setPodReadingList(result.data)
  } 

  async function fetchAllPodData(id) {
    const result = await axios.post('/api/pods/get_all_pod_data/', {"id":id});
    setPodData(result.data)
  }

  /* [] : indicates that this runs ONCE at the start of render */
  useEffect(() => {
    fetchExperimentReadings();
    fetchPodReadings();
    fetchAllPodData(80);
  }, []);

  return (
    <div>

      { JSON.stringify(podData) }

    </div>
  );
}


export default Analysis;