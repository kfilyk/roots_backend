import React, { useState, useEffect } from 'react';
import axios from "axios";
import Popup from "reactjs-popup";

const ExperimentReading = (props) => {
    const [modal, set_modal] = useState(false);
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
    const [selected_pod, set_selected_pod] = useState(-1)


    /*
        For a particular pod reading field, this function finds the value of that field if it already exists given a pod_id
    */
    function find_value_selected_pod(field){
       let reading = pod_readings.filter(reading => reading.pod === selected_pod)[0] ?? null
        if(reading === null){
            return ""
        } else {
            return reading[field]
        }
    }


    async function create_readings(){
        const result = await axios
        .post(`/api/experimentreadings/`, 
          { 
            experiment: experiment_reading.exp_id,
            electrical_conductance : experiment_reading.electrical_conductance,
            reservoir_tds: experiment_reading.reservoir_tds,
            reservoir_ph: experiment_reading.reservoir_ph,
            temperature: experiment_reading.temperature,
            humidity: experiment_reading.humidity,
            pod_readings: pod_readings
          })
        .catch((err) => console.log(err));
      if (result.status === 200){
        console.log("Experiment readings and pod readings uploaded successfully")
      } else {
        console.log("SERVER ERROR: Experiment + pod readings were not uploaded")
      }
    
     }

    function parse_value(field, value){
        switch(field) {
            case 'comment':
                return value
            case 'pod_phase':
                return value
            case 'temperature':
                return parseFloat(value)
            case 'phase':
                return parseInt(value) / 100
            default:
                return parseInt(value)
        }
    }

    /*
        For a particular pod reading field, this function sets the value of that field. If value is null, assumption is not to record that pod reading field.
    */
    function set_value_selected_pod(e){
        let field = e.target.name
        let value = parse_value(field, e.target.value)
        // let value = e.target.value
        let index = pod_readings.findIndex(reading => reading.pod === selected_pod)
        //EDITING A POD READING
         if(index !== -1){
            let updated_pod = pod_readings[index]
            //Updating old value to new value
            if(value !== ""){
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
                    set_pod_readings(pod_readings.filter(reading => reading.pod !== selected_pod))
                } else {
                    set_pod_readings([
                        ...pod_readings.slice(0, index),
                        updated_pod,
                        ...pod_readings.slice(index + 1)
                    ])
                }
            }
        //ADDING A NEW FIELD IN
         } else {
            let reading = {pod: selected_pod, [field]: value}
            set_pod_readings([...pod_readings, reading])
         }
     }

    
    function delete_field(e){
        let field = e.target.name
        let value = e.target.value
        let index = pod_readings.findIndex(reading => reading.pod === selected_pod)
        //EDITING A POD READING
         if(index !== -1){
            let updated_pod = pod_readings[index]
            delete updated_pod[field]
            //If deleting this field means there are no other fields to record, delete this singular pod reading
            if((Object.keys(updated_pod).length) === 1){
                set_pod_readings(pod_readings.filter(reading => reading.pod !== selected_pod))
            } else if (field === 'temperature' || field === 'humidity'){
                updated_pod[field] = parseFloat(value)
            } else {
                set_pod_readings([
                    ...pod_readings.slice(0, index),
                    updated_pod,
                    ...pod_readings.slice(index + 1)
                ])
            }
        }
    }


    function renderPodReading(){
        if (selected_pod !== -1){
            return (
                <div className='pod_r_modal'>
                    <div className='selected_pod_div'>
                        <label> Selected Pod: {selected_pod}</label>
                    </div>
                    <div className="exp_r_form_row">
                        <label> Node Count: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('node_count') || ""} name={"node_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Leaf Count: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('leaf_count') || ""} name={"leaf_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Seeds Germ.: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('seeds_germinated') || ""} name={"seeds_germinated"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className='pr_coverage'>
                        <div>
                            <label> Pest Coverage: </label> 
                            <div>{find_value_selected_pod('pest_coverage') || 0}%</div>
                        </div>
                        <input className="exp_r_input" name="pest_coverage" value={find_value_selected_pod('pest_coverage') || 0} type="range" min={0} max={100} step={25} onChange={(e) => {set_value_selected_pod(e)}} />
                        <button name="pest_coverage" value={""} onClick={(e)=>{delete_field(e)}}>Set to Null</button>
                    </div>
                    <div className='pr_coverage'>
                        <div>
                            <label> Algae Coverage: </label> 
                            <div>{find_value_selected_pod('algae_coverage') || 0}%</div>
                        </div>
                        <input className="exp_r_input" name="algae_coverage" value={find_value_selected_pod('algae_coverage') || 0} type="range" min={0} max={100} step={25} onChange={(e) => {set_value_selected_pod(e)}} />
                        <button name="algae_coverage" value={""} onClick={(e)=>{delete_field(e)}}>Set to Null</button>
                    </div>
                    <div className='pr_coverage'>
                        <div>
                            <label> Blight Coverage: </label> 
                            <div>{find_value_selected_pod('blight_coverage') || 0}%</div>
                        </div>
                        <input className="exp_r_input" name="blight_coverage" value={find_value_selected_pod('blight_coverage') || 0} type="range" min={0} max={100} step={25} onChange={(e) => {set_value_selected_pod(e)}} />
                        <button name="blight_coverage" value={""} onClick={(e)=>{delete_field(e)}}>Set to Null</button>
                    </div>
                    <div className="exp_r_form_row">
                        <label> Harv. Weight: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('harvest_weight') || ""} name={"harvest_weight"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Harv. Count: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('harvest_count') || ""} name={"harvest_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Leaf Count: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('leaf_count') || ""} name={"leaf_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Harv. Quality: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('harvest_quality') || ""} name={"harvest_quality"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Flower Quality: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('flower_quality') || ""} name={"flower_quality"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className='pr_comment'>
                        <label> Comment: </label> 
                        <textarea name={"comment"} value={find_value_selected_pod('comment') || ""} onChange={(e) => {set_value_selected_pod(e)}} cols="40" rows="5"></textarea>
                    </div>
                    <div className="exp_r_form_row">
                        <label> Bud Count: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('bud_count') || ""} name={"bud_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Flower Count: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('flower_count') || ""} name={"flower_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Fruit Ripe #: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('fruit_ripe_count') || ""} name={"fruit_ripe_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Fruit Unripe #: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('fruit_unripe_count') || ""} name={"fruit_unripe_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Leaf: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('leaf_count') || ""} name={"leaf_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Leaf Area Avg: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('leaf_area_avg') || ""} name={"leaf_area_avg"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Max Height: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('max_height') || ""} name={"max_height"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Media to BGP: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('media_to_bgp') || ""} name={"media_to_bgp"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Min Height: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('min_height') || ""} name={"min_height"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Domes: </label> 
                        <input className="exp_r_input" type="number" value={find_value_selected_pod('domes') || ""} name={"domes"} min={0} max={1} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label> Pod Phase: </label> 
                        <select value={find_value_selected_pod('pod_phase') || ""} name={"pod_phase"} onChange={(e) => {set_value_selected_pod(e)}} >
                            <option key={null} value={null}>SELECT PHASE</option>
                            <option value="germination">Germination</option>
                            <option value="seedling">Seedling</option>
                            <option value="vegetative">Vegetative Growth</option>
                            <option value="flowering">Flowering</option>
                            <option value="harvest">Harvest</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            )
        }
    }

    async function fetchData(exp_id){
        const result = await axios
          .post(`/api/experimentreadings/get_last_reading/`, 
            { 
                exp_id: exp_id
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
                    capacity: result.data.capacity,
                    pods: result.data.pods
                })
            } else {
                set_experiment_reading({...experiment_reading, 
                    capacity: result.data.capacity,
                    pods: result.data.pods
                })
            }
        }
    }


    useEffect(() => {
        fetchData(props.exp_id)
    }, [props.exp_id])

    function submit_reading(){
        set_pod_readings(pod_readings.filter(reading => (Object.keys(reading).length !== 1)))
        create_readings()
        // console.log(pod_readings)
    }

    function change_selected_pod(e, pod){
        if (selected_pod !== pod){
            Array.from(document.querySelectorAll('.pod_selection')).forEach((el) => el.classList.remove('pod_selection_active'));
            e.currentTarget.classList.toggle('pod_selection_active');
            set_selected_pod(pod)
        } else {
            //To remove the pod reading form

            e.currentTarget.classList.remove('pod_selection_active');
            set_selected_pod(-1)
        }
    }

    function renderPodSelection(){
        let pod_container = []
        if (experiment_reading.pods !== []){
            for(let i = 0; i < experiment_reading.capacity; i++) {
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
                    <div className="exp_r_form_row">
                            <label> Experiment: {experiment_reading.exp_id}</label> 
                    </div>
                    <div className="exp_pr_modal_content">
                    <div className="exp_r_form_row">
                            <label> E.C.:</label> 
                            <input className="exp_r_input" type="number" value={experiment_reading.electrical_conductance || ""} onChange={(e) => set_experiment_reading({...experiment_reading, electrical_conductance: e.target.value})} />
                    </div>
                    <div className="exp_r_form_row">
                            <label> Reserv. TDS:</label> 
                            <input className="exp_r_input" type="number" value={experiment_reading.reservoir_tds || ""} onChange={(e) => set_experiment_reading({...experiment_reading, reservoir_tds: e.target.value})} />
                    </div>
                    <div className="exp_r_form_row">
                            <label> Reserv. PH:</label> 
                            <input className="exp_r_input" type="number" value={experiment_reading.reservoir_ph || ""} onChange={(e) => set_experiment_reading({...experiment_reading, reservoir_ph: e.target.value})} min={0} max={14}/>
                    </div>
                    <div className="exp_r_form_row">
                            <label> Temp(ºC):</label> 
                            <input className="exp_r_input" type="number" value= {experiment_reading.temperature || ""} onChange= {(e) => set_experiment_reading({...experiment_reading, temperature: e.target.value})} step="0.01" placeholder="e.g. 1.78"></input>
                    </div>
                    <div className="exp_r_form_row">
                            <label> Humidity(%):</label> 
                            <input className="exp_r_input" type="number" value= {experiment_reading.humidity || ""} onChange= {(e) => set_experiment_reading({...experiment_reading, humidity: e.target.value})}></input>
                    </div>
                    <div className='pod_r_modal'>
                        {renderPodSelection()}
                        {renderPodReading()}
                    </div>
                        </div>
                    <button className='save' onClick={() => {
                        submit_reading()
                        close();
                    }}>Save</button>
                    </div>
                </div>
                )}
            </Popup>
        )
    }

    return (
        <div>
            <button onClick={() => set_modal(true)}>ADD READING</button>
            {renderAddModal()}
        </div>
    )
}

export default ExperimentReading