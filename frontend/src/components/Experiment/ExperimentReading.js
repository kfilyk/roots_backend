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

    /*
        Is an array of pod reading objects
    */
    const [pod_readings, set_pod_readings] = useState([]);
    /*
        The selected pod id that the pod reading form is on
    */
    const [selected_pod, set_selected_pod] = useState(null);


    /*
        For a particular pod reading field, this function finds the value of that field if it already exists given a pod_id
    */
    function find_value_selected_pod(field){
       let pod = pod_readings.filter(pod => pod.id === selected_pod)[0] ?? null
        if(pod === null){
            return ""
        } else {
            return pod[field]
        }
    }

    /*
        For a particular pod reading field, this function sets the value of that field. If value is null, assumption is not to record that pod reading field.
    */
    function set_value_selected_pod(e){
        let field = e.target.name
        let value = e.target.value
        let index = pod_readings.findIndex(pod => pod.id === selected_pod)
            //EDITING A POD READING
         if(index !== -1){
            let updated_pod = pod_readings[index]
            //Updating old value to new value
            if(value !== ""){
                if(field === 'comment'){
                    updated_pod[field] = value
                } else {
                    updated_pod[field] = parseInt(value)
                }
                set_pod_readings([
                  ...pod_readings.slice(0, index),
                  updated_pod,
                  ...pod_readings.slice(index + 1)
                ])
            } else {
                //Deleting field from pod reading if value is ""
                delete updated_pod[field]
                //If deleting this field means there are no other fields to record, delete this singular pod reading
                if((Object.keys(updated_pod).length) === 1){
                    set_pod_readings(pod_readings.filter(reading => reading.id !== selected_pod))
                } else {
                    set_pod_readings([
                        ...pod_readings.slice(0, index),
                        updated_pod,
                        ...pod_readings.slice(index + 1)
                    ])
                }
            }
         } else {
            if(field !== 'comment'){
                value = parseInt(value)
            } 
            let reading = {id: selected_pod, [field]: value}
            set_pod_readings([...pod_readings, reading])
         }
     }




    function renderPodReading(){
        if (selected_pod !== null){
            return (
                <div>
                    <div className='form_row'>
                        <label>Selected Pod: {selected_pod}</label>
                    </div>
                    <div className="form_row">
                        <label> Node Count: </label> 
                        <input type="number" value={find_value_selected_pod('node_count') || ""} name={"node_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Leaf Count: </label> 
                        <input type="number" value={find_value_selected_pod('leaf_count') || ""} name={"leaf_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Seeds Germinated: </label> 
                        <input type="number" value={find_value_selected_pod('seeds_germinated') || ""} name={"seeds_germinated"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Pest Coverage: </label> 
                        <input type="number" value={find_value_selected_pod('pest_coverage') || ""} name={"pest_coverage"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Algae Coverage: </label> 
                        <input type="number" value={find_value_selected_pod('algae_coverage') || ""} name={"algae_coverage"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Blight Coverage: </label> 
                        <input type="number" value={find_value_selected_pod('blight_coverage') || ""} name={"blight_coverage"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Seeds: </label> 
                        <input type="number" value={find_value_selected_pod('seeds_germinated') || ""} name={"seeds_germinated"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Harvest Weight: </label> 
                        <input type="number" value={find_value_selected_pod('harvest_weight') || ""} name={"harvest_weight"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Harvest Number: </label> 
                        <input type="number" value={find_value_selected_pod('harvest_number') || ""} name={"harvest_number"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Leaf: </label> 
                        <input type="number" value={find_value_selected_pod('leaf_count') || ""} name={"leaf_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Harvest Quality: </label> 
                        <input type="number" value={find_value_selected_pod('harvest_quality') || ""} name={"harvest_quality"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Flower Quality: </label> 
                        <input type="number" value={find_value_selected_pod('flower_quality') || ""} name={"flower_quality"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Comment: </label> 
                        <textarea name={"comment"} value={find_value_selected_pod('comment') || ""} onChange={(e) => {set_value_selected_pod(e)}} cols="40" rows="5"></textarea>
                        {/* <input type="" value={find_value_selected_pod('comment') || ""} name={"comment"} min={0} onChange={(e) => {set_value_selected_pod(e)}} /> */}
                    </div>
                    <div className="form_row">
                        <label> Bud Count: </label> 
                        <input type="number" value={find_value_selected_pod('bud_count') || ""} name={"bud_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Flower Count: </label> 
                        <input type="number" value={find_value_selected_pod('flower_count') || ""} name={"flower_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Fruit Ripe Count: </label> 
                        <input type="number" value={find_value_selected_pod('fruit_ripe_count') || ""} name={"fruit_ripe_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Fruit Unripe Count: </label> 
                        <input type="number" value={find_value_selected_pod('fruit_unripe_count') || ""} name={"fruit_unripe_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Leaf: </label> 
                        <input type="number" value={find_value_selected_pod('leaf_count') || ""} name={"leaf_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Leaf Area Avg: </label> 
                        <input type="number" value={find_value_selected_pod('leaf_area_avg') || ""} name={"leaf_area_avg"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Max Height: </label> 
                        <input type="number" value={find_value_selected_pod('max_height') || ""} name={"max_height"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Media to BGP: </label> 
                        <input type="number" value={find_value_selected_pod('media_to_bgp') || ""} name={"media_to_bgp"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Min Height: </label> 
                        <input type="number" value={find_value_selected_pod('min_height') || ""} name={"min_height"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="form_row">
                        <label> Domes: </label> 
                        <input type="number" value={find_value_selected_pod('domes') || ""} name={"domes"} min={0} max={1} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                </div>
            )
        }
    }

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
        console.log("SUBMIT: ", pod_readings, experiment_reading)
    }

    function change_selected_pod(e, pod_id){
        if (selected_pod !== pod_id){
            Array.from(document.querySelectorAll('.pod_selection')).forEach((el) => el.classList.remove('pod_selection_active'));
            e.currentTarget.classList.toggle('pod_selection_active');
            set_pod_readings([...pod_readings, {id: pod_id}])
            set_selected_pod(pod_id)
        } else {
            //To remove the pod reading form
            let index = pod_readings.findIndex(pod => pod.id === selected_pod)
            if((Object.keys(pod_readings[index]).length) === 1){
                set_pod_readings(pod_readings.filter(reading => reading.id !== selected_pod))
            }
            e.currentTarget.classList.remove('pod_selection_active');
            set_selected_pod(null)
        }
    }

    function renderPodSelection(){
        let pod_container = []
        if (experiment_reading.pods !== []){
            for(let i = 0; i < experiment_reading.device_capacity; i++) {
                let curr_pod = experiment_reading.pods.filter(pod => pod.position === (i+1))[0] ?? null
                if(curr_pod !== null){
                    pod_container.push(
                        <button key={i} className="pod_selection" onClick={(e) => change_selected_pod(e, curr_pod.id)}>{curr_pod.plant_name}</button> 
                    )
                } else {
                    pod_container.push(
                        <button key={i} disabled className="pod_selection">EMPTY</button> 
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