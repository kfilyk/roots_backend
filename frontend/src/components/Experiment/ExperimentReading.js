import React, { useState, useEffect } from 'react';
import axios from "axios";
import Popup from "reactjs-popup";

const ExperimentReading = (props) => {
    const [modal, set_modal] = useState({show: false, device: -1, experiment: -1});

    function renderAddModal(){
        <Popup open={modal.show} onClose={() => set_modal({...modal, show: false})} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
                <div className="modal_body"  onClick={e => e.stopPropagation()}>
                <div className="modal_type"> Device: {} </div>
                <div className="modal_content">
                <div className="form_row">
                        <label> Experiment: </label> 
                        <select className="" defaultValue={modal.experiment} name="experiment" onChange={(e) => set_modal({...modal, experiment: e.target.value})}>
                            <option key={-1} value={-1}> SELECT EXPERIMENT </option>
                            {available_experiments.map(item => (
                                <option key={item.id} value={item.id}> {item.name} </option>
                            ))}
                        </select> 
                </div>
                    <button className='save' onClick={() => {
                    setExperiment()
                    close();
                }}>Save</button>
                    </div>

                </div>
            </div>
            )}
        </Popup>
    }

    return (
        <div>HELLO</div>
    )
}

export default ExperimentReading