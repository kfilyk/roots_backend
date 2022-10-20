import React, { useRef, useState, useEffect } from 'react';
import axios from "axios";
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

    const img_upload = useRef()
    const [podList, setPodList] = useState(undefined)

    const initExperimentReadingModal = {
        show: false,
        add: false,
        electrical_conductance: "",
        reservoir_ph: "",
        temperature: "",
        humidity: "",
        flushed_reservoir: false,
        raised_light: false,
        failed_pump: false,
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
        fruit_unripe_count: "",
        fruit_ripe_count: "",
        bud_count: "",
        flower_count: "",
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
        selected_images: null,
        image_link_1:"",
        image_link_2:"",
        image_link_3:"",
        image_link_4:"",
    }
    const [podReadingModal, setPodReadingModal] = useState(initPodReadingModal);

    const [progress, setProgress] = useState(0);
    
    const [phase, setPhase] = useState("");
    
    /*
    Input from: props.experimentID
    Outputs to: podList, capacity
    Created by: Kelvin F 08/31/2022
    Last Edit: Kelvin F 08/31/2022
    Purpose: Given an experiment id, retrieves its device's capacity and info about its pods including plant name
    */
    async function setPodReadingsList() {
        //console.log(props.podList)
        let podList = {}
        props.podList.forEach(pod => {
            pod['pod_reading'] = props.podReadingList.filter(pr => parseInt(pr.pod) === parseInt(pod.id))[0] || initPodReadingModal;
            podList[pod.id] = pod
        })
        setPodList(podList)
    } 

    async function getPhase() {
        if(props.experiment['phase_id'] !== -1 || props.experiment['phase_id'] !== null) {
            const ret = await axios.get('/api/phases/'+props.experiment['phase_id'])
            setPhase(ret.data['type'].toLowerCase())
        } else {
            setPhase("concluded") // fix this - if experiment is concluded or terminated, editing an old experiment reading with new photos, label as such with the phase of that reading

        }

    }

    /*
    Input/Called from: useEffect()
    Outputs to: experimentReadingModal object
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: On any changes to props (including on render), set experiment, podList and experiment reading modal
    */
    useEffect(() => {
        setPodReadingsList()
        // set experiment reading data
        setExperimentReadingModal({...experimentReadingModal, ...props.experimentReading})
       // delete experimentReadingModal.experiment;
        getPhase(props.phase);
    }, [])

    /* whenever a pod reading is selected, update the pods + podreadings + experimentreading modals with the selected info */
    useEffect(() => {
        if(podList) {
            if (props?.selectedPod !== -1){
                setPodReadingModal({...initPodReadingModal, ...podList[props.selectedPod].pod_reading})
            } else {
                setPodReadingModal(initPodReadingModal)
            }
        }
    }, [props.selectedPod])

    /* whenever an experiment reading is selected, update the pods + podreadings + experimentreading modals with the selected info */

    useEffect(() => {
        setPodReadingsList()
        if(props.selectedPod !== -1 && props.podReadingList.length !== 0) {
            setPodReadingModal({...initPodReadingModal, ...props.podReadingList.filter(pr => pr.pod === props.selectedPod)[0]})
        } else {
            setPodReadingModal(initPodReadingModal)
        }
        setExperimentReadingModal({...experimentReadingModal, ...props.experimentReading})

    } , [props.experimentReading])

    /* whenever pod reading modal is changed, update the pods + podreadings + experimentreading modals with the selected info */
    useEffect(() => {
        if(podList) {
            setPodList({...podList, [props.selectedPod]: {...podList[props.selectedPod], pod_reading: podReadingModal}})// sets the pod_reading of the currently active pod object while form is open
        }
    },[podReadingModal])


    const uploadImage = (file, species, id, i) => {
        let fname = (id+"_"+phase+"_"+i+"_"+Date.now()+".jpg").toLowerCase();

        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET+"/RootsImages/"+species,
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
        console.log("SUCCESSFUL IMAGE UPLOAD: https://ava-cv-raw-photo-bucket.s3.amazonaws.com/RootsImages/"+species+"/"+fname)
        return "https://ava-cv-raw-photo-bucket.s3.amazonaws.com/RootsImages/"+species+"/"+fname
    }

    function closeExperimentReading() {
        setExperimentReadingModal(initExperimentReadingModal); 
        setPodReadingModal(initPodReadingModal); 
        props.setSelectedPod(-1); 
        props.setSelectedExperiment(-1);
        props.setSelectedExperimentReading(-1);
        props.setExperimentReading({...props.experimentReading, show:false});
        props.setExperimentReading({...props.experimentReading, show:false});

    }
    /*
    Input/Called from: render()
    Outputs to: Database (backend, post to experimentReadingModals and podReadings tables) 
    Created by: Kelvin F @ 08/26/2022
    Last Edit: Kelvin F @ 08/26/2022
    Purpose: This function accesses the api and pushes the experiment reading object
    */  
    async function submitExperimentReading(){
        console.log("FLAG: ", props.experimentReading)
        const empty_pod_reading = JSON.stringify(initPodReadingModal)
        let er = {}
        Object.assign(er, experimentReadingModal);
        Object.keys(er).forEach(key => {if(er[key] === "") er[key]= null}) // set all "" to null
        delete er['show'];
        delete er['add'];
        er['experiment']=props.experiment.id // this shouldn't be necessary to set - experiment reading already has ID reference to experiment in question

        if(props.experimentReading.add) {
            const result = await axios.post(`/api/experimentreadings/`, er)
                .catch((err) => console.log(err));
            if(result && result['status'] === 201) {
                for (const [key, value] of Object.entries(podList)) {
                    if(JSON.stringify(value['pod_reading']) !== empty_pod_reading) {

                        let image_links = []
                        if (value['pod_reading']['selected_images'] != null) {
                            let i = 1
                            console.log(value['pod_reading']['selected_images'])
                            Array.from(value['pod_reading']['selected_images']).forEach(img => {
                                if(i <= 4) {
                                    image_links.push(uploadImage(img, value['species'].toLowerCase(), value['id'], i))
                                    i = i+1
                                }
                            })
                        }
                        
                        // create pod reading object to be pushed
                        let pr = {}

                        Object.assign(pr, value['pod_reading']);
                        Object.keys(pr).forEach(k => {if(pr[k] === "") pr[k]= null}) // set all "" to null
                        pr['pod'] = parseInt(key)
                        pr['experiment'] = props.experiment.id
                        pr['experiment_reading'] = result.data.id // add the newly generated e reading id to the pod reading
                        let i = 1
                        image_links.forEach(link => {
                            pr['image_link_'+i] = link
                            i = i+1
                        })

                        await axios.post(`/api/podreadings/`, pr).catch((err) => console.log(err));
                        console.log("ADDED POD READING: ", pr)
                    } 
                }
            }
        } else {
            const result = await axios.patch(`/api/experimentreadings/${er.id}/`, er)
                .catch((err) => console.log(err));

            if(result && result['status'] === 200) {
                for (const [key, value] of Object.entries(podList)) {
                    if(JSON.stringify(value['pod_reading']) !== empty_pod_reading) {

                        let image_links = []
                        if (value['pod_reading']['selected_images'] != null) {
                            let i = 1
                            console.log(value['pod_reading']['selected_images'])
                            Array.from(value['pod_reading']['selected_images']).forEach(img => {
                                if(i <= 4) {
                                    image_links.push(uploadImage(img, value['species'].toLowerCase(), value['id'], i))
                                    i = i+1
                                }
                            })
                        }

                        let pr = {}
                        Object.assign(pr, value['pod_reading']);
                        Object.keys(pr).forEach(k => {if(pr[k] === "") pr[k]= null}) // set all "" to null
                        delete pr['selected_images']

                        let i = 1
                        image_links.forEach(link => {
                            pr['image_link_'+i] = link
                            i = i+1
                        })

                        if(pr['id'] === undefined) {
                            pr['pod'] =parseInt(key)
                            pr['experiment'] = props.experiment.id
                            pr['experiment_reading'] = result.data.id // add the newly generated e reading id to the pod reading

                            await axios.post(`/api/podreadings/`, pr).catch((err) => console.log("ERROR: ", err));
                            console.log("ADDED POD READING: ", pr);

                        } else {
                            await axios.patch(`/api/podreadings/${pr['id']}/`, pr).catch((err) => console.log(err));
                            console.log("EDITED POD READING: ", pr);
                        }

                    } 
                }

            }
        }
        props.getExperimentReadings()
        props.getPodReadings()

    }

    return (
        <>
        {props.selectedPod !== -1 ? 
            <div className='modal-pod-form'>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setExperimentReadingModal({...experimentReadingModal, flushed_reservoir: !experimentReadingModal.flushed_reservoir})}}><button value= {experimentReadingModal.flushed_reservoir} className={experimentReadingModal.flushed_reservoir === true ? "selected": ""}/>Flushed Reservoir</div>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setExperimentReadingModal({...experimentReadingModal, raised_light: !experimentReadingModal.raised_light})}}><button value= {experimentReadingModal.raised_light} className={experimentReadingModal.raised_light === true ? "selected": ""} />Raised Light</div>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setExperimentReadingModal({...experimentReadingModal, failed_pump: !experimentReadingModal.failed_pump})}}><button value= {experimentReadingModal.failed_pump} className={experimentReadingModal.failed_pump === true ? "selected": ""} />Failed Pump</div>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setPodReadingModal({...podReadingModal, removed_dome: !podReadingModal.removed_dome})}} ><button name="removed_dome" className={podReadingModal.removed_dome === true ? "selected": ""} />Removed Dome</div>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setPodReadingModal({...podReadingModal, pollinated: !podReadingModal.pollinated})}}><button name="pollinated" className={podReadingModal.pollinated === true ? "selected": ""} />Pollinated</div>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setPodReadingModal({...podReadingModal, trellis_adjustment: !podReadingModal.trellis_adjustment})}}><button name="trellis_adjustment" className={podReadingModal.trellis_adjustment === true ? "selected": ""} />Trellis Adjustment</div>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setPodReadingModal({...podReadingModal, pest_removal: !podReadingModal.pest_removal})}}><button name="pest_removal" className={podReadingModal.pest_removal === true ? "selected": ""} />Pest Removal</div>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setPodReadingModal({...podReadingModal, prune_thinned: !podReadingModal.prune_thinned})}}><button name="prune_thinned" className={podReadingModal.prune_thinned === true ? "selected": ""}/>Thinned</div>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setPodReadingModal({...podReadingModal, prune_topped: !podReadingModal.prune_topped})}}><button name="prune_topped" className={podReadingModal.prune_topped === true ? "selected": ""}/>Topped</div>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setPodReadingModal({...podReadingModal, prune_dead_foliage: !podReadingModal.prune_dead_foliage})}}><button name="prune_dead_foliage" className={podReadingModal.prune_dead_foliage === true ? "selected": ""} />Removed Dead Foliage</div>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setPodReadingModal({...podReadingModal, prune_living_foliage: !podReadingModal.prune_living_foliage})}}><button name="prune_living_foliage" className={podReadingModal.prune_living_foliage === true ? "selected": ""} />Removed Living Foliage</div>
                <div className="form_row" onClick={(e) => {e.currentTarget.firstChild.classList.toggle('selected'); setPodReadingModal({...podReadingModal, prune_dead_heading: !podReadingModal.prune_dead_heading})}}><button name="prune_dead_heading" className={podReadingModal.prune_dead_heading === true ? "selected": ""} />Dead Headed</div>

                <div className="form_row">
                    <input placeholder="Conductance"  type="number" value={experimentReadingModal.electrical_conductance} onChange={(e) => setExperimentReadingModal({...experimentReadingModal, electrical_conductance: e.target.value})} min={0} max={20}/>
                    <input placeholder="PH"  type="number" value={experimentReadingModal.reservoir_ph} onChange={(e) => setExperimentReadingModal({...experimentReadingModal, reservoir_ph: e.target.value})} min={0} max={14}/>
                </div>

                <div className="form_row">
                    <input placeholder="Temperature (ºC)" type="number" value= {experimentReadingModal.temperature} onChange= {(e) => setExperimentReadingModal({...experimentReadingModal, temperature: e.target.value})} min={-100} max={100}/>
                    <input placeholder="Humidity (%)" type="number" value= {experimentReadingModal.humidity} onChange= {(e) => setExperimentReadingModal({...experimentReadingModal, humidity: e.target.value})} min={0} max={100}/>
                </div>

                <div className="form_row">
                    <input placeholder="Node Count" type="number" value={podReadingModal.node_count} name={"node_count"} min={0} max={1000} onChange={(e) => setPodReadingModal({...podReadingModal, node_count: e.target.value})} />
                    <input placeholder="Internode Gap (cm)" type="number" value={podReadingModal.internode_distance} name={"internode_distance"} min={0} max={100} onChange={(e) => setPodReadingModal({...podReadingModal, internode_distance: e.target.value})} />
                </div>

                <div className="form_row">
                    <input placeholder="Leaf Count" type="number" value={podReadingModal.leaf_count} name={"leaf_count"} min={0} max={10000} onChange={(e) => setPodReadingModal({...podReadingModal, leaf_count: e.target.value})} />
                    <input placeholder="Germination Rate (%)" type="number" value={podReadingModal.germination_rate} name={"germination_rate"} min={0} max={100} onChange={(e) => setPodReadingModal({...podReadingModal, germination_rate: e.target.value})} />
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
                    <input placeholder="Leaf Area (cm^2)" type="number" value={podReadingModal.leaf_area_avg} name={"leaf_area_avg"} min={0} max={100} onChange={(e) => setPodReadingModal({...podReadingModal, leaf_area_avg: e.target.value})} />
                    <input placeholder="Max Height (cm)" type="number" value={podReadingModal.max_height} name={"max_height"} min={0} max={10000} onChange={(e) => setPodReadingModal({...podReadingModal, max_height: e.target.value})} />
                </div>
                <div className="form_row">
                    <input placeholder="Min Height (cm)" type="number" value={podReadingModal.min_height} name={"min_height"} min={0} max={10000} onChange={(e) => setPodReadingModal({...podReadingModal, min_height: e.target.value})} />
                    <input placeholder="Media to BGP (cm)" type="number" value={podReadingModal.media_to_bgp} name={"media_to_bgp"} min={0} max={100} onChange={(e) => setPodReadingModal({...podReadingModal, media_to_bgp: e.target.value})} />
                </div>

                <div className="form_row">
                    <input placeholder="Bud Count" type="number" value={podReadingModal.bud_count} name={"bud_count"} min={0} max={10000} onChange={(e) => setPodReadingModal({...podReadingModal, bud_count: e.target.value})} />
                    <input placeholder="Flower Count" type="number" value={podReadingModal.flower_count} name={"flower_count"} min={0} max={10000} onChange={(e) => setPodReadingModal({...podReadingModal, flower_count: e.target.value})} />
                </div>

                <div className="form_row">
                    <input placeholder="Unripe Fruit" type="number" value={podReadingModal.fruit_unripe_count} name={"fruit_unripe_count"} min={0} max={10000} onChange={(e) => setPodReadingModal({...podReadingModal, fruit_unripe_count: e.target.value})} />
                    <input placeholder="Ripe Fruit" type="number" value={podReadingModal.fruit_ripe_count} name={"fruit_ripe_count"} min={0} max={10000} onChange={(e) => setPodReadingModal({...podReadingModal, fruit_ripe_count: e.target.value})} />
                </div>

                <div className="form_row">
                    <input placeholder="Harvest Weight (g)" type="number" value={podReadingModal.harvest_weight} name={"harvest_weight"} min={0} max={1000000} onChange={(e) => setPodReadingModal({...podReadingModal, harvest_weight: e.target.value})} />
                    <input placeholder="Harvest Count" type="number" value={podReadingModal.harvest_count} name={"harvest_count"} min={0} max={10000} onChange={(e) => setPodReadingModal({...podReadingModal, harvest_count: e.target.value})} />
                </div>

                <input className ="form_row pr_comment" placeholder="[comment]" type="text" value={podReadingModal.comment !== null ? podReadingModal.comment : ""} onChange={(e) => setPodReadingModal({...podReadingModal, comment: e.target.value})}/>
                <input type="file" style={{"display":"none"}} ref={img_upload} onChange={(e) => setPodReadingModal(prevState => ({...prevState, selected_images:e.target.files}))} multiple/>
                <button onClick={() => {img_upload.current.click()}}>{podReadingModal.image_link_1 ? podReadingModal.image_link_1 : (podReadingModal.selected_images === null ? "Upload Images... " : "Upload "+ podReadingModal.selected_images[0].name+ ", ...") }</button>
                <button className='save' onClick={() => {submitExperimentReading(); closeExperimentReading();}}>Save</button>

            </div> 
      
        :
            <></>
        }
    </> 
    )
}

export default ExperimentReading