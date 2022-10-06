import React, { useState, useEffect } from 'react';
import axios from "axios";
import Popup from "reactjs-popup";
import AWS from 'aws-sdk'


const S3_BUCKET ='ava-cv-raw-photo-bucket';
const REGION ='ca-central-1';

AWS.config.update({
    accessKeyId: 'AKIA3N5PH5YKPJJ7VT2L',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

const ExperimentReading = (props) => {
    // store experiment reading form to be edited by frontend experiment reading modal

    const [pods, setPods] = useState(undefined)

    const [experiment, setExperiment] = useState({})

    const initExperimentReadingModal = {
        show: false,
        add: false,
        pod_capacity: "",
        electrical_conductance: "",
        reservoir_ph: "",
        temperature: "",
        humidity: "",
        flushed_reservoir: false,
        raised_light: false,
        failed_pump: false,
        went_offline: false,
        lost_power: false,
    }
    const [experimentReadingModal, setExperimentReadingModal] = useState(initExperimentReadingModal);

    const initPodReadingModal = {
        node_count: "",
        internode_distance: "",
        leaf_count: "",
        germination_rate: "",
        pest_coverage: "",
        algae_coverage: "",
        blight_coverage: "",
        leaf_area_avg: "",
        max_height: "",
        min_height: "",
        media_to_bgp: "",
        harvest_weight: "",
        harvest_count: "",
        harvest_quality: "",
        fruit_unripe_count: "",
        fruit_ripe_count: "",
        bud_count: "",
        flower_count: "",
        flower_quality: "",
        removed_dome: false,
        pollinated: false,
        trellis_adjustment: false,
        pest_removal: false,
        prune_thinned: false,
        prune_topped: false,
        prune_dead_foliage: false,
        prune_living_foliage: false,
        prune_dead_heading: false,
        comment: "",
        selected_image: null,
        image_link:"",
    }
    const [podReadingModal, setPodReadingModal] = useState({initPodReadingModal});

    // The selected pod id that the pod reading form is on
    const [selectedPod, setSelectedPod] = useState(-1)

    const [progress , setProgress] = useState(0);
    
    const [phase, setPhase] = useState("");
    
    /*
    Input from: props.experimentID
    Outputs to: pods, capacity
    Created by: Kelvin F 08/31/2022
    Last Edit: Kelvin F 08/31/2022
    Purpose: Given an experiment id, retrieves its device's capacity and info about its pods including plant name
    */
    async function getPods(e_id, er_id, status) {
        let podList = {}
        const result = await axios.post(`/api/pods/get_pods/`, {"id":e_id, "status":status});
        result.data.pods.forEach(pod => {
            pod['pod_reading'] = initPodReadingModal;
            podList[pod.id] = pod
        })
        if(!props.input.add) {
            for (const [key, value] of Object.entries(podList)) {
                const result = await axios.post(`/api/podreadings/get_pod_reading/`, {"er_id":er_id, "p_id":key});
                if(Object.keys(result.data).length !== 0) { // if the resultant dictionary isnt {}
                    value['pod_reading'] = result.data
                }
            }
        } 
        setPods(podList)
    } 

    async function getPhase() {
        const ret = await axios.get('/api/phases/'+props?.input.experiment['phase_id'])
        setPhase(ret.data['type'].toLowerCase())
    }

    /*
    Input/Called from: useEffect()
    Outputs to: experimentReadingModal object
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: On render, set experiment, pods and experiment reading modal
    */
    useEffect(() => {
        //get experiment data including pods
        setExperiment(props.input.experiment);
    
        getPods(props?.input.experiment.id, props?.input.id, props?.input.experiment.status)
        // set experiment reading data
        setExperimentReadingModal({...experimentReadingModal, ...props.input})
        delete experimentReadingModal.experiment;
        getPhase(props.phase);
    }, [])

    
    useEffect(() => {
        //console.log(selectedPod)
        if(selectedPod !== -1) {
            setPods({...pods, [selectedPod]: {...pods[selectedPod], pod_reading: podReadingModal}})// sets the pod_reading of the currently active pod object while form is open
        }
    },[podReadingModal])

    const uploadImage = (file, genus, species, id) => {
        let fname = (species+"_"+id+"_"+phase+".jpg").toLowerCase();

        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET+"/RootsImages/"+genus.toLowerCase(),
            Key: fname
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) {
                    console.log(err);
                    return null;
                }
            })
        console.log("SUCCESSFUL IMAGE UPLOAD: https://ava-cv-raw-photo-bucket.s3.amazonaws.com/RootsImages/"+genus.toLowerCase()+"/"+fname)
        return "https://ava-cv-raw-photo-bucket.s3.amazonaws.com/RootsImages/"+genus.toLowerCase()+"/"+fname
    }
    /*
    Input/Called from: render()
    Outputs to: Database (backend, post to experimentReadingModals and podReadings tables) 
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: This function accesses the api and pushes the experiment reading object
    */  
    async function submitExperimentReading(){
        const empty_pod_reading = JSON.stringify(initPodReadingModal)
        let er = {}
        Object.assign(er, experimentReadingModal);
        Object.keys(er).forEach(key => {if(er[key] === "") er[key]= null}) // set all "" to null
        delete er['show'];
        delete er['add'];
        er['experiment']=props.input.experiment.id

        if(props.input.add) {
            const result = await axios.post(`/api/experimentreadings/`, er)
                .catch((err) => console.log(err));
            if(result && result['status'] === 201) {
                for (const [key, value] of Object.entries(pods)) {
                    if(JSON.stringify(value['pod_reading']) !== empty_pod_reading) {

                        let image_link = null
                        if (value['pod_reading']['selected_image'] != null) {
                            image_link = uploadImage(value['pod_reading']['selected_image'], value['genus'], value['species'], value['id'])
                        }
                        
                        // create pod reading object to be pushed
                        let pr = {}
                        delete pr['selected_image']

                        Object.assign(pr, value['pod_reading']);
                        Object.keys(pr).forEach(k => {if(pr[k] === "") pr[k]= null}) // set all "" to null
                        pr['pod'] = parseInt(key)
                        pr['experiment'] = props.input.experiment.id
                        pr['experiment_reading'] = result.data.id // add the newly generated e reading id to the pod reading
                        if(image_link != null) {
                            pr['image_link'] = image_link
                        }
                        await axios.post(`/api/podreadings/`, pr).catch((err) => console.log(err));
                    } 
                }
            }
        } else {
            const result = await axios.patch(`/api/experimentreadings/${er.id}/`, er)
                .catch((err) => console.log(err));

            if(result && result['status'] === 200) {
                for (const [key, value] of Object.entries(pods)) {
                    if(JSON.stringify(value['pod_reading']) !== empty_pod_reading) {

                        let image_link = null
                        if (value['pod_reading']['selected_image'] != null) {
                            image_link = uploadImage(value['pod_reading']['selected_image'], value['genus'], value['species'], value['id'])
                        }
                        let pr = value['pod_reading']
                        delete pr['selected_image']
                        
                        if(image_link != null) {
                            pr['image_link'] = image_link
                        }

                        if(pr['id'] === undefined) {
                            pr['pod'] = key
                            pr['experiment'] = props.input.experiment.id
                            pr['experiment_reading'] = result.data.id // add the newly generated e reading id to the pod reading
                            console.log(await axios.post(`/api/podreadings/`, pr).catch((err) => console.log(err)));
                        } else {
                            console.log(await axios.patch(`/api/podreadings/${pr['id']}/`, pr).catch((err) => console.log(err)));
                        }

                        console.log("POD READING: ", pr);
                    } 
                }

            }
        }
        props.getExperimentReadings(props.input.experiment.id)
    }

    /*
    Input/Called from: renderExperimentReadingModal()
    Outputs to: Frontend form modal (renderExperimentReadingModal()), setSelectedPodValue()
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: Renders all form field inputs for a selected pod reading, calls auxillary setSelectedPodValue() function to store form inputs before submission to backend
    */
    function renderPodReading(){
        if (selectedPod !== -1){
            return (
                <div className='modal-pod-form'>
                    <div className="form_row">
                        <input placeholder="Node Count" type="number" value={podReadingModal.node_count} name={"node_count"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, node_count: e.target.value})} />
                        <input placeholder="Internode Distance" type="number" value={podReadingModal.internode_distance} name={"internode_distance"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, internode_distance: e.target.value})} />
                        <input placeholder="Leaf Count" type="number" value={podReadingModal.leaf_count} name={"leaf_count"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, leaf_count: e.target.value})} />
                        <input placeholder="Germination Rate" type="number" value={podReadingModal.germination_rate} name={"germination_rate"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, germination_rate: e.target.value})} />
                    </div>
                    <div className='pr_coverage'>
                        <label> Pest Coverage: {podReadingModal.pest_coverage}% </label>
                        <input name="pest_coverage" value={podReadingModal.pest_coverage} type="range" min={0} max={100} onChange={(e) => setPodReadingModal({...podReadingModal, pest_coverage: e.target.value})} />
                    </div>
                    <div className='pr_coverage'>
                        <label> Algae Coverage: {podReadingModal.algae_coverage}% </label>
                        <input name="algae_coverage" value={podReadingModal.algae_coverage} type="range" min={0} max={100} onChange={(e) => setPodReadingModal({...podReadingModal, algae_coverage: e.target.value})} />
                    </div>
                    <div className='pr_coverage'>
                        <label> Blight Coverage: {podReadingModal.blight_coverage}% </label>
                        <input name="blight_coverage" value={podReadingModal.blight_coverage} type="range" min={0} max={100} onChange={(e) => setPodReadingModal({...podReadingModal, blight_coverage: e.target.value})} />
                    </div>

                    <div className="form_row">
                        <input placeholder="Mean Leaf Area" type="number" value={podReadingModal.leaf_area_avg} name={"leaf_area_avg"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, leaf_area_avg: e.target.value})} />
                        <input placeholder="Max Height (cm)" type="number" value={podReadingModal.max_height} name={"max_height"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, max_height: e.target.value})} />
                        <input placeholder="Min Height (cm)" type="number" value={podReadingModal.min_height} name={"min_height"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, min_height: e.target.value})} />
                        <input placeholder="Media to BGP (cm)" type="number" value={podReadingModal.media_to_bgp} name={"media_to_bgp"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, media_to_bgp: e.target.value})} />
                    </div>
                    <div className="form_row">
                        <input placeholder="Harvest Weight" type="number" value={podReadingModal.harvest_weight} name={"harvest_weight"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, harvest_weight: e.target.value})} />
                        <input placeholder="Harvest Count" type="number" value={podReadingModal.harvest_count} name={"harvest_count"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, harvest_count: e.target.value})} />
                        <input placeholder="Harvest Quality" type="number" value={podReadingModal.harvest_quality} name={"harvest_quality"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, harvest_quality: e.target.value})} />
                        <input placeholder="Unripe Fruit" type="number" value={podReadingModal.fruit_unripe_count} name={"fruit_unripe_count"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, fruit_unripe_count: e.target.value})} />
                    </div>
                    <div className="form_row">
                        <input placeholder="Ripe Fruit" type="number" value={podReadingModal.fruit_ripe_count} name={"fruit_ripe_count"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, fruit_ripe_count: e.target.value})} />
                        <input placeholder="Bud Count" type="number" value={podReadingModal.bud_count} name={"bud_count"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, bud_count: e.target.value})} />
                        <input placeholder="Flower Count" type="number" value={podReadingModal.flower_count} name={"flower_count"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, flower_count: e.target.value})} />
                        <input placeholder="Flower Quality" type="number" value={podReadingModal.flower_quality} name={"flower_quality"} min={0} onChange={(e) => setPodReadingModal({...podReadingModal, flower_quality: e.target.value})} />
                    </div>
                    <div className="form_row"><button name="removed_dome" className={podReadingModal.removed_dome === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setPodReadingModal({...podReadingModal, removed_dome: !podReadingModal.removed_dome})}} />Removed Dome</div>
                    <div className="form_row"><button name="pollinated" className={podReadingModal.pollinated === true ? "selected": ""}  onClick={(e) => {e.currentTarget.classList.toggle('selected'); setPodReadingModal({...podReadingModal, pollinated: !podReadingModal.pollinated})}}/>Pollinated</div>
                    <div className="form_row"><button name="trellis_adjustment" className={podReadingModal.trellis_adjustment === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setPodReadingModal({...podReadingModal, trellis_adjustment: !podReadingModal.trellis_adjustment})}}/>Trellis Adjustment</div>
                    <div className="form_row"><button name="pest_removal" className={podReadingModal.pest_removal === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setPodReadingModal({...podReadingModal, pest_removal: !podReadingModal.pest_removal})}}/>Pest Removal</div>

                    <div className="form_row"><button name="prune_thinned" className={podReadingModal.prune_thinned === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setPodReadingModal({...podReadingModal, prune_thinned: !podReadingModal.prune_thinned})}}/>Thinned</div>
                    <div className="form_row"><button name="prune_topped" className={podReadingModal.prune_topped === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setPodReadingModal({...podReadingModal, prune_topped: !podReadingModal.prune_topped})}}/>Topped</div>
                    <div className="form_row"><button name="prune_dead_foliage" className={podReadingModal.prune_dead_foliage === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setPodReadingModal({...podReadingModal, prune_dead_foliage: !podReadingModal.prune_dead_foliage})}}/>Removed Dead Foliage</div>
                    <div className="form_row"><button name="prune_living_foliage" className={podReadingModal.prune_living_foliage === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setPodReadingModal({...podReadingModal, prune_living_foliage: !podReadingModal.prune_living_foliage})}}/>Removed Living Foliage</div>
                    <div className="form_row"><button name="prune_dead_heading" className={podReadingModal.prune_dead_heading === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setPodReadingModal({...podReadingModal, prune_dead_heading: !podReadingModal.prune_dead_heading})}}/>Dead Headed</div>
                    <input className ="form_row pr_comment" placeholder="[comment]" type="text" value={podReadingModal.comment} onChange={(e) => setPodReadingModal({...podReadingModal, comment: e.target.value})}/>
                    <div>{podReadingModal.image_link}</div>
                
                    <input type="file" onChange={(e) => setPodReadingModal(prevState => ({...prevState, selected_image:e.target.files[0]}))}/>
                </div>
            )
        }
    }

    function changeSelectedPod(e, pod){
        if (selectedPod !== pod.id){
            Array.from(document.querySelectorAll('.nav-link')).forEach((el) => el.classList.remove('active'));
            e.currentTarget.classList.toggle('active');
            setPodReadingModal({...initPodReadingModal, ...pod.pod_reading})
            setSelectedPod(pod.id)
        } else {
            //To remove the pod reading form
            e.currentTarget.classList.remove('active');
            setPodReadingModal({initPodReadingModal})
            setSelectedPod(-1)
        }
    }

    function renderPodSelection(){
        let pod_container = []
        if (pods !== undefined) {
            for (const [key, value] of Object.entries(pods)) {
                pod_container.push(
                    <div className="pod-selection nav-link " key={value.position} onClick={(e) => {changeSelectedPod(e, value)}}>{value.position + ". "+value.plant_name}</div> 
                )           
            }
        }
        return pod_container
      }

    return (
        <Popup open={experimentReadingModal.show} onClose={() => {setExperimentReadingModal(initExperimentReadingModal); setPodReadingModal(initPodReadingModal); setSelectedPod(-1); props.setExperimentReadingInput({...props.input, show:false})}} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
                <div className="modal_body_reading" onClick={e => e.stopPropagation()}>
                <div className="modal_type">{experiment?.name}: Experiment Reading </div>
                <div className="modal_content_2">
                    <div className="modal-experiment-reading">
                        <div className="form_row"> <input className = "exp-general-input" type="number" value={experimentReadingModal.electrical_conductance} onChange={(e) => setExperimentReadingModal({...experimentReadingModal, electrical_conductance: e.target.value})}/>Electrical Conductance</div>
                        <div className="form_row"> <input className = "exp-general-input" type="number" value={experimentReadingModal.reservoir_ph} onChange={(e) => setExperimentReadingModal({...experimentReadingModal, reservoir_ph: e.target.value})} min={0} max={14}/>PH </div>
                        <div className="form_row"> <input className = "exp-general-input" type="number" value= {experimentReadingModal.temperature} onChange= {(e) => setExperimentReadingModal({...experimentReadingModal, temperature: e.target.value})} min={-100} max={100}/>ºC Temperature</div>
                        <div className="form_row"> <input className = "exp-general-input" type="number" value= {experimentReadingModal.humidity} onChange= {(e) => setExperimentReadingModal({...experimentReadingModal, humidity: e.target.value})} min={0} max={100}/>% Humidity</div>
                        <div className="form_row"><button value= {experimentReadingModal.flushed_reservoir} className={experimentReadingModal.flushed_reservoir === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setExperimentReadingModal({...experimentReadingModal, flushed_reservoir: !experimentReadingModal.flushed_reservoir})}}/>Flushed Reservoir</div>
                        <div className="form_row"><button value= {experimentReadingModal.raised_light} className={experimentReadingModal.raised_light === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setExperimentReadingModal({...experimentReadingModal, raised_light: !experimentReadingModal.raised_light})}}/>Raised Light</div>
                        <div className="form_row"><button value= {experimentReadingModal.failed_pump} className={experimentReadingModal.failed_pump === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setExperimentReadingModal({...experimentReadingModal, failed_pump: !experimentReadingModal.failed_pump})}}/>Failed Pump</div>
                        <div className="form_row"><button value= {experimentReadingModal.went_offline} className={experimentReadingModal.went_offline === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setExperimentReadingModal({...experimentReadingModal, went_offline: !experimentReadingModal.went_offline})}}/>Went Offline</div>
                        <div className="form_row"><button value= {experimentReadingModal.lost_power} className={experimentReadingModal.lost_power === true ? "selected": ""} onClick={(e) => {e.currentTarget.classList.toggle('selected'); setExperimentReadingModal({...experimentReadingModal, lost_power: !experimentReadingModal.lost_power})}}/>Lost Power</div>
                        <div className='modal-pod-selection'>{renderPodSelection()}</div>
                    </div>
                    <div className='modal-pod-reading'>
                        {renderPodReading()}
                    </div>
                </div>
                <button className='save' onClick={() => {
                    submitExperimentReading()
                    close();
                }}>Save</button>
                </div>
            </div>
            )}
        </Popup>
    )

}

export default ExperimentReading