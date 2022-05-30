import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PhaseBlock = (props) => {

  async function fetchData(props) {
    /*
    const result = await axios(
      `/api/pods/?experiment=${props.experimentID}`,
    )*/
  } 

  useEffect(() => {
    fetchData(props);
  }, []);

  function render(){
    return <div>xyz</div> ;
  };

  return (
    render()
  );
}


export default PhaseBlock;