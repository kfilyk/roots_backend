import React, { useState, useEffect } from 'react';
import axios from "axios";
import Popup from "reactjs-popup";
import AWS from 'aws-sdk';

const ExperimentReading = (props) => {
    const [modal, set_modal] = useState(false);

    const [experiment_reading, set_experiment_reading] = useState({
        // To be done automatically
        // water_level: -1,
        // reading_date: -1,
        electrical_conductance: null,
        reservoir_ph: null,
        temperature: null,
        humidity: null,
        exp_id: null,
        exp_phase: null,
        pods: [], // 
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
        if(field === 'pod_phase') {
            let ph = experiment_reading.pods[selected_pod].phase
            if (ph === 0) {
                return "germination"
            } else if(ph === 1) {
                return "seedling"
            } else if(ph === 2) {
                return "vegetative"
            } else if(ph === 3) {
                return "flowering"
            } else if(ph === 4) {
                return "harvest"
            } else if(ph === 5) {
                return "other"
            }
        }
        let reading = pod_readings.filter(reading => reading.pod === selected_pod)[0] ?? null
            if(reading === null){
                return ""
            } else {
                return reading[field]
            }
    }

    /*
        this function accesses the api and pushes the experiment reading object (including pods)
    */
    async function create_readings(){
        /*
        const s3 = new AWS.S3({
            //accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            //secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,

            accessKeyId: "AKIA3N5PH5YKPJJ7VT2L",
            secretAccessKey: "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",

        })
        */

        // include the phases of the pods at the time of reading
        for(let p in pod_readings) {
            pod_readings[p]['pod_phase'] = experiment_reading.pods[p].phase

            // upload photos to AWS in a seperate process
            //console.log(pod_readings[p]['photos'][0])
            /*
            const uploadedImage = await s3.upload({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: req.files[0].originalFilename,
                Body: blob,
            }).promise()
            */
        }

        const result = await axios
            .post(`/api/experimentreadings/`, 
            { 
                experiment: experiment_reading.exp_id,
                electrical_conductance : experiment_reading.electrical_conductance,
                reservoir_ph: experiment_reading.reservoir_ph,
                temperature: experiment_reading.temperature,
                humidity: experiment_reading.humidity,
                pod_readings: pod_readings
            })
            .catch((err) => console.log(err));
        if (result.status === 200){
            console.log("Experiment readings and pod readings uploaded successfully")
            // refresh devices
        } else {
            console.log("SERVER ERROR: Experiment + pod readings were not uploaded")
        }
        
     }

    function parse_value(field, value){
        if (value === null || value === "") {
            return null
        }

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
        let index = pod_readings.findIndex(reading => reading.pod === selected_pod)

        // if a pod reading has not been created yet
         if(index !== -1){
            let updated_pod = pod_readings[index]

            if(field === 'photos') {
                let images = []
                const files = e.target.files;
                for (let i = 0; i < files.length; i++) {
                    if (files[i].type.match(/^image\//)) {
                        images.push(files[i])            
                    }
                }
                updated_pod[field] = images

                set_pod_readings([
                    ...pod_readings.slice(0, index),
                    updated_pod,
                    ...pod_readings.slice(index + 1)
                ])

            } else if(value !== "") {
                updated_pod[field] = value
                // insert copy of updated pod into index 
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
        //Otherwise, add a new field in
        } else {
            let reading = {pod: selected_pod, [field]: value}

            if(field === 'photos') {
                let images = []
                const files = e.target.files;
                for (let i = 0; i < files.length; i++) {
                    if (files[i].type.match(/^image\//)) {
                        images.push(files[i])            
                    }
                }
                reading = {pod: selected_pod, [field]: images}
            }
            set_pod_readings([...pod_readings, reading])
        }
     }

    function renderPodReading(){
        if (selected_pod !== -1){
            return (
                <div className='pod_r_modal'>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Node Count" type="number" value={find_value_selected_pod('node_count') || ""} name={"node_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Mean Internode Distance" type="number" value={find_value_selected_pod('internode_distance') || ""} name={"internode_distance"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Leaf Count" type="number" value={find_value_selected_pod('leaf_count') || ""} name={"leaf_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Germination Rate" type="number" value={find_value_selected_pod('germination_rate') || ""} name={"germination_rate"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className='pr_coverage'>
                        <label> Pest Coverage: {find_value_selected_pod('pest_coverage') || 0}% </label>
                        <input className="exp_r_input" name="pest_coverage" value={find_value_selected_pod('pest_coverage') || 0} type="range" min={0} max={100} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className='pr_coverage'>
                        <label> Algae Coverage: {find_value_selected_pod('algae_coverage') || 0}% </label>
                        <input className="exp_r_input" name="algae_coverage" value={find_value_selected_pod('algae_coverage') || 0} type="range" min={0} max={100} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className='pr_coverage'>
                        <label> Blight Coverage: {find_value_selected_pod('blight_coverage') || 0}% </label>
                        <input className="exp_r_input" name="blight_coverage" value={find_value_selected_pod('blight_coverage') || 0} type="range" min={0} max={100} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Harvest Weight" type="number" value={find_value_selected_pod('harvest_weight') || ""} name={"harvest_weight"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Harvest Count" type="number" value={find_value_selected_pod('harvest_count') || ""} name={"harvest_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Harvest Quality" type="number" value={find_value_selected_pod('harvest_quality') || ""} name={"harvest_quality"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Flower Quality" type="number" value={find_value_selected_pod('flower_quality') || ""} name={"flower_quality"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className='pr_comment'>
                        <textarea name={"comment"} placeholder="[comment]" value={find_value_selected_pod('comment') || ""} onChange={(e) => {set_value_selected_pod(e)}} cols="40" rows="5"></textarea>
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Bud Count" type="number" value={find_value_selected_pod('bud_count') || ""} name={"bud_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input"  placeholder="Flower Count" type="number" value={find_value_selected_pod('flower_count') || ""} name={"flower_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input"  placeholder="Fruit Ripe #" type="number" value={find_value_selected_pod('fruit_ripe_count') || ""} name={"fruit_ripe_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Fruit Unripe" type="number" value={find_value_selected_pod('fruit_unripe_count') || ""} name={"fruit_unripe_count"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Mean Leaf Area" type="number" value={find_value_selected_pod('leaf_area_avg') || ""} name={"leaf_area_avg"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Max Height" type="number" value={find_value_selected_pod('max_height') || ""} name={"max_height"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input"  placeholder="Min Height" type="number" value={find_value_selected_pod('min_height') || ""} name={"min_height"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Media to BGP" type="number" value={find_value_selected_pod('media_to_bgp') || ""} name={"media_to_bgp"} min={0} onChange={(e) => {set_value_selected_pod(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label>
                            <input className="exp_r_input" type="checkbox" name={"dome"} onChange={(e) => {set_value_selected_pod(e); console.log(e)}} />
                            Dome
                        </label>
                    </div>
                    <div className="exp_r_form_row">
                        <input type="file" accept="image/*" name="photos" capture="camera" onChange={(e) => {set_value_selected_pod(e)}}/>
                    </div>
                </div>
            )
        }
    }

    // Sends get request to populate experiment reading object with previous reading data if possible
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
                    exp_id: props.exp_id,
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
        //console.log(experiment_reading.pods)
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
            <Popup open={modal} onClose={() => {set_modal({show: false}); set_pod_readings([]); set_selected_pod(-1);}} modal nested>
                {(close) => (
                <div className="modal" onClick={close}>
                    <div className="modal_body_reading"  onClick={e => e.stopPropagation()}>
                    <div className="modal_type">{props.exp_name}: Experiment Reading </div>
                    <div className="exp_pr_modal_content">
                        <div className="exp_general">
                            <div className="exp_r_form_row">
                                    <input className="exp_r_input"  placeholder="Electrical Conductance" type="number" value={experiment_reading.electrical_conductance || null} onChange={(e) => set_experiment_reading({...experiment_reading, electrical_conductance: e.target.value})} />
                            </div>
                            <div className="exp_r_form_row">
                                    <input className="exp_r_input" placeholder="PH" type="number" value={experiment_reading.reservoir_ph || null} onChange={(e) => set_experiment_reading({...experiment_reading, reservoir_ph: e.target.value})} min={0} max={14}/>
                            </div>
                            <div className="exp_r_form_row">
                                    <input className="exp_r_input"  placeholder="Temperature (ºC)" type="number" value= {experiment_reading.temperature || null} onChange= {(e) => set_experiment_reading({...experiment_reading, temperature: e.target.value})} step="0.01"></input>
                            </div>
                            <div className="exp_r_form_row">
                                    <input className="exp_r_input" placeholder="Humidity (%)" type="number" value= {experiment_reading.humidity || null} onChange= {(e) => set_experiment_reading({...experiment_reading, humidity: e.target.value})}></input>
                            </div>
                        </div>
                        <div className='pod_r_modal_2'>
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