import React, { Component, useState,  } from "react";
import Popup from "reactjs-popup";
import axios from "axios";
import "./experiment.css"

const ExperimentModal = (props) => {
  // const [plant_list, setPlantList] = useState(props.plant_list);
  // const [pod_list, setPodList] = useState([]);
  // const [device_list, setDeviceList] = useState(props.device_list);
  const [add_or_edit, setAddorEdit] = useState(props.add_or_edit)
  
  function submitModal(){
    console.log("EDIT")
  }

  return (
<Popup
        trigger={<button> 
          { add_or_edit === "add" ? "+" : "EDIT" }
        </button>}
        modal
        nested
      >
        
        {(close) => (
          <div className="modal" onClick={close}>
              TEST
          </div>
        )}
      </Popup>
  );
}


export default ExperimentModal;