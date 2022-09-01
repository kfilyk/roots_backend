import React, { useState, useEffect } from 'react';
import axios from "axios";
import Popup from "reactjs-popup";
import AWS from 'aws-sdk';

const ExperimentReading = (props) => {
    const [modal, setModal] = useState(false);

    // store experiment reading form to be edited by frontend experiment reading modal
    const [experimentReading, setExperimentReading] = useState({
        // To be done automatically
        // water_level: -1,
        // reading_date: -1,
        electrical_conductance: null,
        reservoir_ph: null,
        temperature: null,
        humidity: null,
        flushed_reservoir: false,
        raised_light: false,
        failed_pump: false,
        went_offline: false,
        lost_power: false,

        exp_id: null,
        exp_phase: null,
        pods: [], 
        first_reading: true,
    });

    // An array of pod reading objects
    const [podReadings, setPodReadings] = useState([]);

    // The selected pod id that the pod reading form is on
    const [selectedPod, setSelectedPod] = useState(-1)

     /*
    Input/Called from: renderPodReading()
    Outputs to: renderPodReading() 
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose:  Return a form value for a field associated with a particular pod reading (during the creation of an experiment reading; note the value is stored client side, not pulled from the backend)
    */  
    function findSelectedPodValue(field){
        if(field === 'pod_phase') {
            let ph = experimentReading.pods[selectedPod].phase
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
        let reading = podReadings.filter(reading => reading.pod === selectedPod)[0] ?? null
            if(reading === null){
                return ""
            } else {
                return reading[field]
            }
    }

    /*
    Input/Called from: submitReadings()
    Outputs to: Database (backend, post to experimentReadings and podReadings tables) 
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: This function accesses the api and pushes the experiment reading and pod reading objects
    Issues: S3 bucket access needs to be implemented for photo transfer
    */  
    async function createReadings(){
        /*
        const s3 = new AWS.S3({
            //accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            //secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,

            accessKeyId: "AKIA3N5PH5YKPJJ7VT2L",
            secretAccessKey: "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",

        })
        */

        // include the phases of the pods at the time of reading
        for(let p in podReadings) {
            podReadings[p]['pod_phase'] = experimentReading.pods[p].phase

            // upload photos to AWS in a seperate process
            //console.log(podReadings[p]['photos'][0])
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
                experiment: experimentReading.exp_id,
                electrical_conductance : experimentReading.electrical_conductance,
                reservoir_ph: experimentReading.reservoir_ph,
                temperature: experimentReading.temperature,
                humidity: experimentReading.humidity,
                flushed_reservoir: experimentReading.flushed_reservoir,
                raised_light: experimentReading.raised_light,
                failed_pump: experimentReading.failed_pump, 
                went_offline: experimentReading.went_offline,
                lost_power: experimentReading.lost_power,
                pod_readings: podReadings,
            })
            .catch((err) => console.log(err));

        if (result){
            console.log("Experiment readings and pod readings uploaded successfully")
            // refresh devices
        } else {
            console.log("SERVER ERROR: Experiment + pod readings were not uploaded")
        }
     }

    /*
    Input/Called from: renderPodReading()
    Outputs to: podReadings form object
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: For a particular pod reading field, this function sets the value of that field. If value is null, assumption is not to record that pod reading field.
    */
    function setSelectedPodValue(e){
        let field = e.target.name
        let value = null;
        if(e.target.type === "checkbox") {
            value = e.target.checked
        } else if (e.target.type === "number") {
            value = parseInt(e.target.value)
        } else if (e.target.type === "textarea"){
            value = e.target.value
        } else if (e.target.type === "range"){
            value = parseInt(e.target.value)
        }

        let index = podReadings.findIndex(reading => reading.pod === selectedPod)
        console.log("FIELD/VALUE: "+ field +"/"+value)
        // if a pod reading has not been created yet
         if(index !== -1){
            let updated_pod = podReadings[index]

            if(field === 'photos') {
                let images = []
                const files = e.target.files;
                for (let i = 0; i < files.length; i++) {
                    if (files[i].type.match(/^image\//)) {
                        images.push(files[i])            
                    }
                }
                updated_pod[field] = images

                setPodReadings([
                    ...podReadings.slice(0, index),
                    updated_pod,
                    ...podReadings.slice(index + 1)
                ])

            } else if(value !== "") {
                updated_pod[field] = value
                // insert copy of updated pod into index 
                setPodReadings([
                    ...podReadings.slice(0, index),
                    updated_pod,
                    ...podReadings.slice(index + 1)
                ])
            } else {
                //Deleting field from pod reading if value is ""
                delete updated_pod[field]
                //If deleting this field means there are no other fields to record, delete this singular pod reading
                if((Object.keys(updated_pod).length) === 1){
                    setPodReadings(podReadings.filter(reading => reading.pod !== selectedPod))
                } else {
                    setPodReadings([
                        ...podReadings.slice(0, index),
                        updated_pod,
                        ...podReadings.slice(index + 1)
                    ])
                }
            }
        //Otherwise, add a new field in
        } else {
            let reading = {pod: selectedPod, [field]: value}

            if(field === 'photos') {
                let images = []
                const files = e.target.files;
                for (let i = 0; i < files.length; i++) {
                    if (files[i].type.match(/^image\//)) {
                        images.push(files[i])            
                    }
                }
                reading = {pod: selectedPod, [field]: images}
            }
            setPodReadings([...podReadings, reading])
        }
     }

    /*
    Input/Called from: renderModal()
    Outputs to: Frontend form modal (renderModal()), setSelectedPodValue()
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: Renders all form field inputs for a selected pod reading, calls auxillary setSelectedPodValue() function to store form inputs before submission to backend
    */
    function renderPodReading(){
        if (selectedPod !== -1){
            return (
                <div className='pod_r_modal'>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Node Count" type="number" value={findSelectedPodValue('node_count') || ""} name={"node_count"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Mean Internode Distance" type="number" value={findSelectedPodValue('internode_distance') || ""} name={"internode_distance"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Leaf Count" type="number" value={findSelectedPodValue('leaf_count') || ""} name={"leaf_count"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Germination Rate" type="number" value={findSelectedPodValue('germination_rate') || ""} name={"germination_rate"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className='pr_coverage'>
                        <label> Pest Coverage: {findSelectedPodValue('pest_coverage') || 0}% </label>
                        <input className="exp_r_input" name="pest_coverage" value={findSelectedPodValue('pest_coverage') || 0} type="range" min={0} max={100} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className='pr_coverage'>
                        <label> Algae Coverage: {findSelectedPodValue('algae_coverage') || 0}% </label>
                        <input className="exp_r_input" name="algae_coverage" value={findSelectedPodValue('algae_coverage') || 0} type="range" min={0} max={100} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className='pr_coverage'>
                        <label> Blight Coverage: {findSelectedPodValue('blight_coverage') || 0}% </label>
                        <input className="exp_r_input" name="blight_coverage" value={findSelectedPodValue('blight_coverage') || 0} type="range" min={0} max={100} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Harvest Weight" type="number" value={findSelectedPodValue('harvest_weight') || ""} name={"harvest_weight"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Harvest Count" type="number" value={findSelectedPodValue('harvest_count') || ""} name={"harvest_count"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Harvest Quality" type="number" value={findSelectedPodValue('harvest_quality') || ""} name={"harvest_quality"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Flower Quality" type="number" value={findSelectedPodValue('flower_quality') || ""} name={"flower_quality"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className='pr_comment'>
                        <textarea name={"comment"} placeholder="[comment]" value={findSelectedPodValue('comment') || ""} onChange={(e) => {setSelectedPodValue(e)} } cols="40" rows="5"></textarea>
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Bud Count" type="number" value={findSelectedPodValue('bud_count') || ""} name={"bud_count"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input"  placeholder="Flower Count" type="number" value={findSelectedPodValue('flower_count') || ""} name={"flower_count"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input"  placeholder="Fruit Ripe #" type="number" value={findSelectedPodValue('fruit_ripe_count') || ""} name={"fruit_ripe_count"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Fruit Unripe" type="number" value={findSelectedPodValue('fruit_unripe_count') || ""} name={"fruit_unripe_count"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Mean Leaf Area" type="number" value={findSelectedPodValue('leaf_area_avg') || ""} name={"leaf_area_avg"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Max Height" type="number" value={findSelectedPodValue('max_height') || ""} name={"max_height"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input"  placeholder="Min Height" type="number" value={findSelectedPodValue('min_height') || ""} name={"min_height"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <input className="exp_r_input" placeholder="Media to BGP" type="number" value={findSelectedPodValue('media_to_bgp') || ""} name={"media_to_bgp"} min={0} onChange={(e) => {setSelectedPodValue(e)}} />
                    </div>
                    <div className="exp_r_form_row">
                        <label><input className="exp_r_input" type="checkbox" name="removed_dome" onChange={(e) => {setSelectedPodValue(e)}} />Removed Dome</label>
                    </div>
                    <div className="exp_r_form_row">
                        <label><input className="exp_r_input" type="checkbox" name="pollinated" onChange={(e) => {setSelectedPodValue(e)}} />Pollinated</label>
                    </div>
                    <div className="exp_r_form_row">
                        <label><input className="exp_r_input" type="checkbox" name="trellis_adjustment" onChange={(e) => {setSelectedPodValue(e)}} />Trellis Adjustment</label>
                    </div>
                    <div className="exp_r_form_row">
                        <label><input className="exp_r_input" type="checkbox" name="pest_removal" onChange={(e) => {setSelectedPodValue(e)}} />Pest Removal</label>
                    </div>
                    <div className="exp_r_form_row">
                        <label><input className="exp_r_input" type="checkbox" name="prune_thinned" onChange={(e) => {setSelectedPodValue(e)}} />Thinned</label>
                    </div>
                    <div className="exp_r_form_row">
                        <label><input className="exp_r_input" type="checkbox" name="prune_topped" onChange={(e) => {setSelectedPodValue(e)}} />Topped</label>
                    </div>
                    <div className="exp_r_form_row">
                        <label><input className="exp_r_input" type="checkbox" name="prune_dead_foliage" onChange={(e) => {setSelectedPodValue(e)}} />Removed Dead Foliage</label>
                    </div>
                    <div className="exp_r_form_row">
                        <label><input className="exp_r_input" type="checkbox" name="prune_living_foliage" onChange={(e) => {setSelectedPodValue(e)}} />Removed Living Foliage</label>
                    </div>
                    <div className="exp_r_form_row">
                        <label><input className="exp_r_input" type="checkbox" name="prune_dead_heading" onChange={(e) => {setSelectedPodValue(e); console.log(e)}} />Dead Headed</label>
                    </div>

                    <div className="exp_r_form_row">
                        <input type="file" accept="image/*" name="photos" capture="camera" onChange={(e) => {setSelectedPodValue(e)}}/>
                    </div>
                </div>
            )
        }
    }

    /*
    Input/Called from: useEffect()
    Outputs to: experimentReading form object
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: Sends GET request to populate experiment reading object with previous reading data (if possible)
    */
    async function fetchData(exp_id){
        const result = await axios
          .post(`/api/experimentreadings/get_last_reading/`, 
            { 
                exp_id: exp_id
            });
        if (result.status === 200) {
            if (result.data.latest_reading.exp_id !== -1 ){
                // note: dont carry forward the booleans
                setExperimentReading({...experimentReading, 
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
                setExperimentReading({...experimentReading, 
                    exp_id: props.exp_id,
                    capacity: result.data.capacity,
                    pods: result.data.pods
                })
            }
        }
    }

    /*
    Input/Called from: useEffect()
    Outputs to: experimentReading form object
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: Whenever experiment ID (target of a new experiment reading addition) changes, refetch
    */
    useEffect(() => {
        fetchData(props.exp_id)
    }, [props.exp_id])

    /*
    Input/Called from: Frontend save() button
    Outputs to: Backend API -> Database
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: ...
    */
    function submitReading(){
        setPodReadings(podReadings.filter(reading => (Object.keys(reading).length !== 1))) // shortens pod readings array to just those which are actaully filled out
        createReadings()
    }

    function changeSelectedPod(e, pod){
        if (selectedPod !== pod){
            Array.from(document.querySelectorAll('.pod_selection')).forEach((el) => el.classList.remove('pod_selection_active'));
            e.currentTarget.classList.toggle('pod_selection_active');
            setSelectedPod(pod)
        } else {
            //To remove the pod reading form
            e.currentTarget.classList.remove('pod_selection_active');
            setSelectedPod(-1)

        }
    }

    function renderPodSelection(){
        let pod_container = []
        //console.log(experimentReading.pods)
        if (experimentReading.pods !== []){
            for(let i = 0; i < experimentReading.capacity; i++) {
                let curr_pod = experimentReading.pods.filter(pod => pod.position === (i+1))[0] ?? null
                if(curr_pod !== null){
                    pod_container.push(
                        <button key={i} className="pod_selection" onClick={(e) => changeSelectedPod(e, curr_pod.id)}>{curr_pod.plant_name}</button> 
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

    function renderModal(){
        return (
            <Popup open={modal} onClose={() => {setModal({show: false}); setPodReadings([]); setSelectedPod(-1);}} modal nested>
                {(close) => (
                <div className="modal" onClick={close}>
                    <div className="modal_body_reading"  onClick={e => e.stopPropagation()}>
                    <div className="modal_type">{props.exp_name}: Experiment Reading </div>
                    <div className="exp_pr_modal_content">
                        <div className="exp_general">
                            <div className="exp_r_form_row">
                                    <input className="exp_r_input"  placeholder="Electrical Conductance" type="number" value={experimentReading.electrical_conductance} onChange={(e) => setExperimentReading({...experimentReading, electrical_conductance: e.target.value})} />
                            </div>
                            <div className="exp_r_form_row">
                                    <input className="exp_r_input" placeholder="PH" type="number" value={experimentReading.reservoir_ph} onChange={(e) => setExperimentReading({...experimentReading, reservoir_ph: e.target.value})} min={0} max={14}/>
                            </div>
                            <div className="exp_r_form_row">
                                    <input className="exp_r_input"  placeholder="Temperature" type="number" value= {experimentReading.temperature} onChange= {(e) => setExperimentReading({...experimentReading, temperature: e.target.value})} min={-100} max={100}></input>ºC
                            </div>
                            <div className="exp_r_form_row">
                                    <input className="exp_r_input" placeholder="Humidity" type="number" value= {experimentReading.humidity} onChange= {(e) => setExperimentReading({...experimentReading, humidity: e.target.value})} min={0} max={100}></input>%
                            </div>
                            <div className="exp_r_form_row">

                                <label> <input className="exp_r_input" type="checkbox" value= {experimentReading.flushed_reservoir} onChange={(e) => {setExperimentReading({...experimentReading, flushed_reservoir: e.target.checked})}}/> Flushed Reservoir </label>
                            </div>
                            <div className="exp_r_form_row">
                                <label> <input className="exp_r_input" type="checkbox" value= {experimentReading.raised_light} onChange={(e) => setExperimentReading({...experimentReading, raised_light: e.target.checked})}/> Raised Light </label>
                            </div>
                            <div className="exp_r_form_row">
                                <label> <input className="exp_r_input" type="checkbox" value= {experimentReading.failed_pump} onChange={(e) => setExperimentReading({...experimentReading, failed_pump: e.target.checked})}/> Failed Pump </label>
                            </div>
                            <div className="exp_r_form_row">
                                <label> <input className="exp_r_input" type="checkbox" value= {experimentReading.went_offline} onChange={(e) => setExperimentReading({...experimentReading, went_offline: e.target.checked})}/> Went Offline </label>
                            </div>
                            <div className="exp_r_form_row">
                                <label> <input className="exp_r_input" type="checkbox" value= {experimentReading.lost_power} onChange={(e) => setExperimentReading({...experimentReading, lost_power: e.target.checked})}/> Lost Power </label>
                            </div>

                        </div>
                        <div className='pod_r_modal_2'>
                            {renderPodSelection()}
                            {renderPodReading()}
                        </div>
                    </div>
                    <button className='save' onClick={() => {
                        submitReading()
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
            <button onClick={() => setModal(true)}>ADD READING</button>
            {renderModal()}
        </div>
    )
}

export default ExperimentReading