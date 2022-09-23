import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import menu_icon from "../../img/menu_icon.png"

const Analysis = () => {
  const [er_list, setExperimentReadingList] = useState([]);
  const [pr_list, setPodReadingList] = useState([]);


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

  /* [] : indicates that this runs ONCE at the start of render */
  useEffect(() => {
    fetchExperimentReadings();
    fetchPodReadings();
  }, []);

  return (
    <div>

      { JSON.stringify(er_list) }
      { JSON.stringify(pr_list) }

    </div>
  );
}


export default Analysis;