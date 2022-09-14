import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./recipebar.css"
import Popup from "reactjs-popup";
import white_light_icon from "../../img/white_light_icon.png"
import blue_light_icon from "../../img/blue_light_icon.png"
import red_light_icon from "../../img/red_light_icon.png"
import water_icon from "../../img/water_icon.png"

const RecipeBar = (props) => {
  // we NEED this recipe state object, because the props is variably a recipe id OR a recipe object
  // Recipe we're creating the progress bar for
  const [recipe, setRecipe] = useState(null);

  //end date of recipe
  const [end_date, setEndDate] = useState(null);

   //start date of recipe
  const [start_date, setStartDate] = useState(null);

   //based on today's date and the recipe's start + end date, calculate completion as a percentage
  const [completionPercentage, setCompletionPercentage] = useState(0);

  //List of all dates where readings were taken
  const [expReadingDates, setExpReadingDates] = useState([])

  // initial phase object state prior to add/edit
  const initPhaseModal = {
    show: false,
    add: false,
    id: -1,
    days: null,
    waterings_per_day: null,
    watering_duration: null,
    blue_intensity: null,
    red_intensity: null,
    white_intensity: null,
    lights_on_hours: null,
    score: null,
    type: null,
  }
  const [phaseModal, setPhaseModal] = useState(initPhaseModal)

  //Saves state as we record a new experiment reading
  const [experimentReadingModal, setExperimentReadingModal] = useState({
    show: false,
    add: false,
    id: -1,
    reading_date: null, 
    electrical_conductance: null,
    reservoir_ph: null,
    temperature: null,
    humidity: null,
    failed_pump: null,
    lost_power: null,
    flushed_reservoir: null,
    went_offline: null,
    raised_light: null,
  });

  

  /*
  Input from: None
  Outputs to: recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Fetches a recipe given a recipe id
  */
  async function getRecipe(id) {
    //console.log("RECIPE ID: ", id)
    const result = await axios(
      `/api/recipes/${id}/`,
    )
    .catch((err) => console.log(err))
    //console.log("RESULT: ", result)

    if(result.status === 200) {
      setRecipe(result.data)
    }

  }

  /*
  Input from: None
  Outputs to: expReadingDates
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Fetches all experiment readings for an experiment given a experiment id
  */
  async function getReadings(id) {
    const result = await axios.post(`/api/experimentreadings/exp_reading_dates/`,
    { 
      exp_id: id
    }).catch((err) => console.log(err))
    if (result.status === 200){
      setExpReadingDates(result.data)
    }
  }

  /*
  Input from: None
  Outputs to: experimentReadingModal
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Fetches a specific experiment reading given a experiment reading id
  */
  async function getSingleReading(id) {
    const result = await axios(
      `/api/experimentreadings/${id}`
    )
    .catch((err) => console.log(err))
    setExperimentReadingModal(result.data)
  }

  /*
  Input from: props.recipe
  Outputs to: recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Upon page load, sets the recipe object and experiment id given from props
  */
  useEffect(() => {
    // can either send a recipe object OR the id of a recipe to this function
    //console.log("PROPS RECIPE: ", props.recipe)
    if(typeof props.recipe === 'number') {
      getRecipe(props.recipe)
    } else {
      setRecipe(props.recipe)
    }

    if(props?.experiment?.id !== undefined){
      getReadings(props.experiment.id)
      setEndDate(props.experiment.end_date)
      setStartDate(props.experiment.start_date)
    }
  }, []); // [] causes useEffect to only happen ONCE after initial render - will not be called as a result of any other change

  /*
  Input from: props.recipe
  Outputs to: recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Upon props.recipe change, updates the recipe object
  */
  useEffect(() => {
    if(typeof props.recipe === 'number') {
      getRecipe(props.recipe)
    } else {
      setRecipe(props.recipe)
    }  
  }, [props.recipe])
  
  /*
  Input from: props, recipe
  Outputs to: endDate, completionPercentage
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Upon props or recipe change, updates the completion percentage, start date and end date.
  */
  useEffect(() => {
    if(recipe !== null && (typeof props.experiment !== 'undefined')) {
      let sd = new Date(props.experiment.start_date)
      sd.setDate(sd.getDate()+recipe.days)
      setEndDate(sd.getFullYear()+ "-"+(sd.getMonth()+1)+"-"+sd.getDate())
      calcCompletionPercentage(props.experiment.day, recipe.days)
    }
  }, [props, recipe]); // useEffect runs when props OR recipe changes

  /*
  Input from: render()
  Outputs to: render()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Based on type of phase, returns a specific background and text colour
  */
  function phaseStyle(type)  {
    let colour = '';
    let font_colour = '';
    if(type === "Germination" ) {
      colour = `#B1C985`
      font_colour = `#FFFFFF`
    } else if(type === "Seedling" ) {
      colour = `#7AA96A`
      font_colour = `#FFFFFF`
    } else if(type === "Vegetative") {
      colour = `#2A7351`
      font_colour = `#FFFFFF`
    } else if(type === "Flowering") {
      colour = `#DEB1B1`
      font_colour = `#FFFFFF`
    } else if(type === "Harvest") {
      colour = `#D14C4C`
      font_colour = `#FFFFFF`
    } else { // other type
      colour = `#6FC1B6`
      font_colour = `#FFFFFF`
    }
    let style = {
      backgroundColor: colour,
      color: font_colour
    };
    return style;
  };

  /*
  Input from: renderExpReadingTags()
  Outputs to: expReadingDates
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Given an exp reading id, sends an API call to get details of exp reading
  */
  async function show_exp_reading(id){
    await getSingleReading(id)
    setExperimentReadingModal({...experimentReadingModal, show:true})
  }


  /*
  Input from: expReadingDates
  Outputs to: render()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 09/03/2022
  Purpose: Given a list of exp reading dates, calculates where they should be placed on timeline, and returns positions accordingly
  */
  function renderExpReadingTags(){
    if (expReadingDates !== undefined){
      let tags = []
      expReadingDates.map((er, index) => {
        let date = new Date(er.reading_date)
        let date_string = date.toISOString().substring(5,10)
        let start = new Date(start_date)
        let end = new Date(end_date)
        let style = Math.floor(( ( date - start ) / ( end - start ) ) * 100) + "%";

        // console.log("START DATE: ", start_date)
        // console.log("ADD DATE: ", mid, start, end, style)
        tags.push(
            <a key={`${er.id}_${index}`} onClick={() => show_exp_reading(er.id)} style={{left: `calc(${style})`}} className="tooltip exp_reading_triangle" data-tooltip={date_string}>▼</a>
        )
      })
      return tags
    }
  }

  /*
  Input from: props.experiment, completionPercentage
  Outputs to: render()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Given a list of exp reading dates, calculates where it should be placed on timeline.
  */
  function renderTimestamps() {
    if(props.experiment){
      return (
        <>
          {renderExpReadingTags()}
          <div className="recipe_bar_timestamps">
            <div className="recipe_bar_start_date" >{props.experiment.start_date.slice(0,10) + " | "+ props.recipe_name} </div>
            <div className="recipe_bar_end_date">{end_date} </div>
          </div> 
          <div>
            <div style={ { width: `${ completionPercentage }%` } } className="recipe_bar_progress_line"></div>
          </div>
        </>
      )
    }
  }

  /*
  Input from: useEffect()
  Outputs to: completionPercentage
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Calculates completion of recipe based on exp_day / total number of recipe days
  */
  function calcCompletionPercentage(exp_days, recipe_days){
    let percent = Math.round(exp_days/recipe_days*100)
    if (percent > 100){
      percent = 100
    }
    setCompletionPercentage(percent)
  }

  /*
  Input from: experimentReadingModal
  Outputs to: render()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Renders experimentReadingModal that display info about a particular experiment reading.
  */
  function renderExperimentReadingModal(){
    return (
        <Popup open={experimentReadingModal.show} onClose={() => setExperimentReadingModal({...experimentReadingModal, show:false})} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
                <div className="modal_body_2"  onClick={e => e.stopPropagation()}>
                    <div className="modal_content">
                        <div className="exp_general">
                            <div className="exp_r_form_row">Reading Date: {experimentReadingModal.reading_date || "N/A"} </div>
                            <div className="exp_r_form_row">Electrical Conductance: {experimentReadingModal.electrical_conductance || "N/A"}</div>
                            <div className="exp_r_form_row">Reservoir PH: {experimentReadingModal.reservoir_ph || "N/A"}</div>
                            <div className="exp_r_form_row">Temperature: {experimentReadingModal.temperature || "N/A"}</div>
                            <div className="exp_r_form_row">Humidity: {experimentReadingModal.humidity || "N/A"}</div>
                            {experimentReadingModal.failed_pump ? <div className="experimentReading_indicator">Failed Pump </div> : <></>}
                            {experimentReadingModal.flushed_reservoir ? <div className="experimentReading_indicator">Flushed Reservoir</div>: <></>}
                            {experimentReadingModal.lost_power ? <div className="experimentReading_indicator">Lost Power</div>: <></>}
                            {experimentReadingModal.raised_light ? <div className="experimentReading_indicator">Raised Light</div>: <></>}
                            {experimentReadingModal.went_offline ? <div className="experimentReading_indicator">Went Offline</div>: <></>}

                          </div>
                        <button className='save' onClick={() => { close(); }}>Close</button>
                    </div>
                </div>
            </div>
            )}
        </Popup>
    )
  }


  async function submitPhaseModal(e){
    if(phaseModal.add){
      await axios.post(`/api/phases/`, phaseModal).catch((err) => console.log(err)); 
    } else {
      await axios.patch(`/api/phases/${phaseModal.id}/`, phaseModal).catch((err) => console.log(err));
    }
    setPhaseModal(initPhaseModal);
    props.fetchPhases()
  }


    /*
  Input from: phaseModal
  Outputs to: render()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Renders phaseModal to allow manipulation of a particular recipe phase
  */

  function renderPhaseModal(){
    return (
      <Popup open={phaseModal.show} onClose={() => setPhaseModal({...phaseModal, show: false})} modal nested>
        {(close) => (
        <div className="modal" onClick={close}>
            <div className="modal_body"  onClick={e => e.stopPropagation()}>
            <div className="modal_type"> { phaseModal.add === true ? "Add Phase" : "Edit Phase" } </div>
                <div className="modal_content">
                    <select className="form_row" value={phaseModal.type} onChange={(e) => setPhaseModal({...phaseModal, type: e.target.value})} >
                      <option value="Germination">Germination</option>
                      <option value="Seedling">Seedling</option>
                      <option value="Vegetative">Vegetative Growth</option>
                      <option value="Flowering">Flowering</option>
                      <option value="Harvest">Harvest</option>
                      <option value="Other">Other</option>
                    </select>
                    <input className="form_row" value={phaseModal.days} placeholder={"Days"} min="1" type="number" onKeyPress= {(e) => {if(e.charCode === 45) {e.preventDefault()}}} onChange={(e) => setPhaseModal({...phaseModal, days: e.target.value})} />
                    <input className="form_row" value={phaseModal.waterings_per_day} placeholder={"Waterings Per Day"} onChange={(e) => setPhaseModal({...phaseModal, waterings_per_day: e.target.value})} />
                    <input className="form_row" value={phaseModal.watering_duration} placeholder={"Watering Duration"} onChange={(e) => setPhaseModal({...phaseModal, watering_duration: e.target.value})} />
                    <div className="form_row">
                      <input value={phaseModal.blue_intensity} id="blue_intensity_slider" className="slider" type="range" min={0} max={99} onChange={(e) => setPhaseModal({...phaseModal, blue_intensity: e.target.value})}/>
                      <div className='intensity_text_overlay'>{phaseModal.blue_intensity}</div>
                    </div>
                    <div className="form_row">
                      <input value={phaseModal.red_intensity} id="red_intensity_slider" className="slider" type="range" min={0} max={99} onChange={(e) => setPhaseModal({...phaseModal, red_intensity: e.target.value})} />
                      <div className='intensity_text_overlay'>{phaseModal.red_intensity}</div>
                    </div>                    
                    <div className="form_row">
                      <input value={phaseModal.white_intensity}  id="white_intensity_slider" className="slider" type="range" min={0} max={99} onChange={(e) => setPhaseModal({...phaseModal, white_intensity: e.target.value})} />
                      <div className='intensity_text_overlay'>{phaseModal.white_intensity}</div>
                    </div>   
                    <input className="form_row" value={phaseModal.lights_on_hours} placeholder={"Lights On Hours"} onChange={(e) => setPhaseModal({...phaseModal, lights_on_hours: e.target.value})} />

                    <button className='save' onClick={() => { submitPhaseModal(); close(); }}>Save</button>
                </div>
            </div>
        </div>
        )}
    </Popup>

    )
  }


  function renderPhaseDetails(ph) {
    return (
      <div className="phase_content">
        <div className="watering">
          {(() => {
            let waterings = [];
            for(let i = 0; i < ph.waterings_per_day; i++) {
              waterings.push(<img key={`${i}`} src={water_icon} alt="Water" style={{width:'20px', padding:'3px' }}/>)
            }

            return waterings;
          })()}
          / day, {ph.watering_duration} minute(s) each
        </div>
        <div className="phase_lighting">
          <div style={{minWidth:'20px', maxWidth:'20px', padding:'3px', paddingBottom:'0px'}}> <img src={blue_light_icon} alt="Blue Light"></img> <div className="light_intensity" >{ph.blue_intensity}</div> </div>
          <div style={{minWidth:'20px', maxWidth:'20px', padding:'3px', paddingBottom:'0px'}}> <img src={red_light_icon} alt="Red Light" ></img> <div className="light_intensity">{ph.red_intensity}</div> </div>
          <div style={{minWidth:'20px', maxWidth:'20px', padding:'3px', paddingBottom:'0px'}}> <img src={white_light_icon} alt="White Light"></img> <div className="light_intensity">{ph.white_intensity}</div> </div>
          , { ph.lights_on_hours } hours per day
        </div>
      </div>
    )
  }

  /*
  Input from: phaseList, renderExpReadingTags(); renderTimestamps(); phases; renderExperimentReadingModal();
  Outputs to: return()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Renders all phase components that make up the RecipeBar
  */
  function render() {
    if(recipe === null ||  props.phaseList.length === 0 || typeof recipe === 'undefined') {
      return <div className="empty_object"> NO RECIPE ALLOCATED </div>;
    } else {
      let phases = []
      for(let i = 1; i <= 10; i++) {
          let ph = props.phaseList.filter(phase => phase.id === recipe["phase"+i])[0] ?? null
          if(ph !== null) {
              // allocate  size proportional to number of phase days
              let s = phaseStyle(ph.type)
              s['flex']= ph.days + " 1 0"
              if(i === 1) {
                  s['borderBottomLeftRadius'] = '10px'
              } 
              if (recipe["phase"+(i+1)] === null || i === 10) {
                s['borderBottomRightRadius'] = '10px'
              } else {
                s['boxShadow'] = 'inset -10px 0px 20px -20px #000000';
              }
              if(props.is_object) {
                phases.push(<div key={`${props.experiment}_${i}`} className="recipe_bar_phase" style={s} onClick={() => {ph['show']=true; ph['add']=false; setPhaseModal(ph)}}> 
                  <span className="recipe_bar_phase_days">{ph.days}</span> 
                  <span className="recipe_bar_phase_type bold_font"> {ph.type} </span>
                  {renderPhaseDetails(ph)}

                </div>)
              } else {
                phases.push(<div key={`${props.experiment}_${i}`} className="recipe_bar_phase" style={s} > 
                  <span className="recipe_bar_phase_days">{ph.days}</span> 
                  <span className="recipe_bar_phase_type"> {ph.type} </span>
                  <div className="popup">{renderPhaseDetails(ph)}</div>

                </div>)
              }
          }
      }
      return ( 
        <div className="recipe_bar">
          {/*{renderExpReadingTags()}*/}
          {renderTimestamps()}
          {/* <div style={ { width: `${ completionPercentage }%` } } className="recipe_bar_progress_line"></div> */}
          <div className="recipe_bar_phases"> 
            {phases} 
          </div>
          {renderExperimentReadingModal()}
          {renderPhaseModal()}

        </div>
      )
    }
  };

  /*
  Input from: render()
  Outputs to: Screen
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Renders the entire RecipeBar oobject
  */
  return (
    render()
  );

}

export default RecipeBar;