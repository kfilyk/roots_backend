import React, { useState, useEffect } from 'react';
import axios from "axios";
import Popup from "reactjs-popup";

const ExperimentReading = (props) => {
    const [modal, set_modal] = useState(true);
    const [experiment_reading, set_experiment_reading] = useState({
        // To be done automatically
        // water_level: -1,
        // reading_date: -1,
        electrical_conductance: -1,
        reservoir_tds: -1,
        reservoir_ph: -1,
        temperature: 0,
        humidity: -1,
        exp_id: -1,
        exp_ph: -1,
        pods: []
    });

    // async function fetchData(){
    //     const result = await 
    //     // set_experiment_reading({...experiment_reading, exp_id: props.exp_id});
    // }


    // useEffect(() => {
    //     fetchData(props)
    // }, [props])

    function submit_reading(){
        console.log("SUBMIT: ", experiment_reading)
    }

    function renderPodReadingModal(){
        return (
            <div>
                HEYA
            </div>
        )
    }


    function renderAddModal(){
        return (
            <Popup open={modal} onClose={() => set_modal({show: false})} modal nested>
                {(close) => (
                <div className="modal" onClick={close}>
                    <div className="modal_body"  onClick={e => e.stopPropagation()}>
                    <div className="modal_type"> Add Experiment Reading {} </div>
                    <div className="modal_content">
                    <div className="form_row">
                            <label> Experiment: {experiment_reading.id}</label> 
                    </div>
                    <div className="form_row">
                            <label> Electrical Conductance:</label> 
                            <button onClick={() => set_experiment_reading({...experiment_reading, electrical_conductance: experiment_reading.electrical_conductance - 1})}>-</button>
                            <input type="number" value={experiment_reading.electrical_conductance} onChange={(e) => set_experiment_reading({...experiment_reading, electrical_conductance: e.target.value})} />
                            <button onClick={() => set_experiment_reading({...experiment_reading, electrical_conductance: experiment_reading.electrical_conductance + 1})}>+</button>
                    </div>
                    <div className="form_row">
                            <label> Reservoir TDS:</label> 
                            <button onClick={() => set_experiment_reading({...experiment_reading, reservoir_tds: experiment_reading.reservoir_tds - 1})}>-</button>
                            <input type="number" value={experiment_reading.reservoir_tds} onChange={(e) => set_experiment_reading({...experiment_reading, reservoir_tds: e.target.value})} />
                            <button onClick={() => set_experiment_reading({...experiment_reading, reservoir_tds: experiment_reading.reservoir_tds + 1})}>+</button>
                    </div>
                    <div className="form_row">
                            <label> Reservoir PH:</label> 
                            <button onClick={() => set_experiment_reading({...experiment_reading, reservoir_ph: experiment_reading.reservoir_ph - 1})}>-</button>
                            <input type="number" value={experiment_reading.reservoir_ph} onChange={(e) => set_experiment_reading({...experiment_reading, reservoir_ph: e.target.value})} />
                            <button onClick={() => set_experiment_reading({...experiment_reading, reservoir_ph: experiment_reading.reservoir_ph + 1})}>+</button>
                    </div>
                    <div className="form_row">
                            <label> Temperature:</label> 
                            <input type="number" value= {experiment_reading.temperature} onChange= {(e) => set_experiment_reading({...experiment_reading, temperature: e.target.value})} step="0.01" placeholder="e.g. 1.78"></input>
                    </div>
                    <div className="form_row">
                            <label> Humidity:</label> 
                            <input type="number" value= {experiment_reading.humidity} onChange= {(e) => set_experiment_reading({...experiment_reading, humidity: e.target.value})} step="0.01" placeholder="e.g. 1.22"></input>
                    </div>
                    <button className='save' onClick={() => {
                        submit_reading()
                        close();
                    }}>Save</button>
                        </div>

                    </div>
                </div>
                )}
            </Popup>
        )
    }

    return (
        <div>
            HELLO
            <button onClick={() => set_modal(true)}>Add Experiment Reading</button>
            {renderAddModal()}
        </div>
    )
}

export default ExperimentReading