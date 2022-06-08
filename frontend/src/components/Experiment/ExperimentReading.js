import React, { useState, useEffect } from 'react';
import axios from "axios";
import Popup from "reactjs-popup";
import './experiment.css';

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
        exp_phase: -1,
        pods: [],
        first_reading: true,
    });

    // const [pod_readings, set_pod_readings] = useState([]);
    const [pod_readings, set_pod_readings] = useState([{
        node_count: null,
        pod_reading: null,
        leaf_count: null,
        seeds_germinated: null,
        pest_coverage: null,
        algae_coverage: null,
        blight_coverage: null,
        harvest_weight: null,
        harvest_number: null,
        harvest_quality: null,
        flower_quality: null,
        comment: null,
        exp_id: null,
        exp_reading_id: null,
        bud_count: null,
        flower_count: null,
        fruit_ripe_count: null,
        fruit_unripe_count: null,
        leaf_area_avg: null,
        max_height: null,
        media_to_bgp: null,
        min_height: null,
        pod_phase: null,
        score: null,
        domes: null,
    }]);

    async function fetchData(props){
        const result = await axios
          .post(`/api/experimentreadings/get_last_reading/`, 
            { 
                exp_id: props.exp_id
            });
        if (result.status === 200) {
            if (result.data.latest_reading.exp_id !== -1 ){
                set_experiment_reading({...experiment_reading, 
                    electrical_conductance: result.data.latest_reading.electrical_conductance,
                    reservoir_tds: result.data.latest_reading.reservoir_tds,
                    reservoir_ph: result.data.latest_reading.reservoir_ph,
                    temperature: result.data.latest_reading.temperature,
                    humidity: result.data.latest_reading.humidity,
                    exp_id: result.data.latest_reading.experiment,
                    exp_phase: result.data.latest_reading.experiment_phase,
                    first_reading: false,
                    device_capacity: result.data.device_capacity,
                    pods: result.data.pods
                })
            } else {
                set_experiment_reading({...experiment_reading, 
                    device_capacity: result.data.device_capacity,
                    pods: result.data.pods
                })
            }
        }
    }


    useEffect(() => {
        fetchData(props)
    }, [props])

    function submit_reading(){
        console.log("SUBMIT: ", experiment_reading)
    }

    function renderPodReading(){
        return (
            <div>
                <div className="form_row">
                    <label> Experiment: </label> 
                </div>
            </div>
        )
    }

    function renderPodSelection(){
        let pod_container = []
        if (experiment_reading.pods !== []){
            for(let i = 0; i < experiment_reading.device_capacity; i++) {
                let curr_pod = experiment_reading.pods.filter(pod => pod.position === (i+1))[0] ?? null
                // console.log("DD: ", curr_pod)
                if(curr_pod !== null){
                    pod_container.push(
                        <button className="pod_selection" onClick={() => console.log(curr_pod)}>{curr_pod.plant_name}</button> 
                    )
                } else {
                    pod_container.push(
                        <button disabled className="pod_selection">EMPTY</button> 
                    )
                }
            }
        }
        return pod_container
      }


    function renderAddModal(){
        return (
            <Popup open={modal} onClose={() => set_modal({show: false})} modal nested>
                {(close) => (
                <div className="modal" onClick={close}>
                    <div className="modal_body_reading"  onClick={e => e.stopPropagation()}>
                    <div className="modal_type"> Add Experiment Reading {} </div>
                    <div className="modal_content">
                    <div className="form_row">
                            <label> Experiment: {experiment_reading.exp_id}</label> 
                    </div>
                    <div className="form_row">
                            <label> Electrical Conductance:</label> 
                            <input type="number" value={experiment_reading.electrical_conductance} onChange={(e) => set_experiment_reading({...experiment_reading, electrical_conductance: e.target.value})} />
                    </div>
                    <div className="form_row">
                            <label> Reservoir TDS:</label> 
                            <input type="number" value={experiment_reading.reservoir_tds} onChange={(e) => set_experiment_reading({...experiment_reading, reservoir_tds: e.target.value})} />
                    </div>
                    <div className="form_row">
                            <label> Reservoir PH:</label> 
                            <input type="number" value={experiment_reading.reservoir_ph} onChange={(e) => set_experiment_reading({...experiment_reading, reservoir_ph: e.target.value})} />
                    </div>
                    <div className="form_row">
                            <label> Temperature:</label> 
                            <input type="number" value= {experiment_reading.temperature} onChange= {(e) => set_experiment_reading({...experiment_reading, temperature: e.target.value})} step="0.01" placeholder="e.g. 1.78"></input>
                    </div>
                    <div className="form_row">
                            <label> Humidity:</label> 
                            <input type="number" value= {experiment_reading.humidity} onChange= {(e) => set_experiment_reading({...experiment_reading, humidity: e.target.value})} step="0.01" placeholder="e.g. 1.22"></input>
                    </div>
                    <div>
                        {renderPodSelection()}
                        {renderPodReading()}
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