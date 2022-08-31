import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./recipebar.css"
import Popup from "reactjs-popup";

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

   //Variable controlling whether modal should be shown or hidden
  const [modal, setModal] = useState(false)

  //Saves state as we record a new experiment reading
  const [experimentReading, setExperimentReading] = useState({
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
    const result = await axios(
      `/api/recipes/${id}/`,
    )
    .catch((err) => console.log(err))
    setRecipe(result.data)
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
    if (result && result.status === 200){
      setExpReadingDates(result.data)
    }
  }

  /*
  Input from: None
  Outputs to: experimentReading
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Fetches a specific experiment reading given a experiment reading id
  */
  async function getSingleReading(id) {
    const result = await axios(
      `/api/experimentreadings/${id}`
    )
    .catch((err) => console.log(err))
    setExperimentReading(result.data)
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
    setModal(true)
  }


  /*
  Input from: expReadingDates
  Outputs to: render()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Given a list of exp reading dates, calculates where it should be placed on timeline.
  */
  function renderExpReadingTags(){
    if (expReadingDates !== undefined){
      let bars = []
      expReadingDates.map((er, index) => {
        let mid = new Date(er.reading_date)
        let mid_string = mid.toISOString().substring(5,10)
        let start = new Date(start_date)
        let end = new Date(end_date)
        let style = Math.round(( ( mid - start ) / ( end - start ) ) * 100) + "%";

        // console.log("START DATE: ", start_date)
        // console.log("ADD DATE: ", mid, start, end, style)
        bars.push(
            <a key={`${er.id}_${index}`} onClick={() => show_exp_reading(er.id)} style={{left: `calc(${style})`}} className="tooltip exp_reading_triangle" data-tooltip={mid_string}>▼</a>
        )
      })
      return bars
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
        <div>
          <div className="recipe_bar_timestamps">
            <div className="recipe_bar_start_date" >{props.experiment.start_date.slice(0,10) + " | "+ props.recipe_name} </div>
            <div className="recipe_bar_end_date">{end_date} </div>
          </div> 
          <div>
            <div style={ { width: `${ completionPercentage }%` } } className="recipe_horizontal_line"></div>
          </div>
          {/* <div className="recipe_bar_timestamps">  */}

        </div>
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
  Input from: experimentReading
  Outputs to: render()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Renders modal that display info about a particular experiment reading.
  */
  function renderModal(){
    console.log(experimentReading)
    return (
        <Popup open={modal} onClose={() => setModal(false)} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
                <div className="modal_body_2"  onClick={e => e.stopPropagation()}>
                    <div className="modal_content">
                        <div className="exp_general">
                            <div className="exp_r_form_row">Reading Date: {experimentReading.reading_date || "N/A"} </div>
                            <div className="exp_r_form_row">Electrical Conductance: {experimentReading.electrical_conductance || "N/A"}</div>
                            <div className="exp_r_form_row">Reservoir PH: {experimentReading.reservoir_ph || "N/A"}</div>
                            <div className="exp_r_form_row">Temperature: {experimentReading.temperature || "N/A"}</div>
                            <div className="exp_r_form_row">Humidity: {experimentReading.humidity || "N/A"}</div>
                            {experimentReading.failed_pump ? <div className="experimentReading_indicator">Failed Pump </div> : <></>}
                            {experimentReading.flushed_reservoir ? <div className="experimentReading_indicator">Flushed Reservoir</div>: <></>}
                            {experimentReading.lost_power ? <div className="experimentReading_indicator">Lost Power</div>: <></>}
                            {experimentReading.raised_light ? <div className="experimentReading_indicator">Raised Light</div>: <></>}
                            {experimentReading.went_offline ? <div className="experimentReading_indicator">Went Offline</div>: <></>}

                          </div>
                        <button className='save' onClick={() => {
                            close();
                        }}>Close</button>
                    </div>
                </div>
            </div>
            )}
        </Popup>
    )
  }

  /*
  Input from: phaseList, renderExpReadingTags(); renderTimestamps(); phases; renderModal();
  Outputs to: return()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Renders all components that make up the RecipeBar
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
              let dtt = ph.name
              if(props.is_object) {
                phases.push(<div key={`${props.experiment}_${i}`} className="recipe_bar_phase" style={s} > 
                  <span className="recipe_bar_phase_days">{ph.days}</span> 
                  <span className= "recipe_bar_phase_name bold_font">{ph.name}<br></br></span>
                  <span className="recipe_bar_phase_type"> {ph.type} </span>
                </div>)
              } else {
                phases.push(<div key={`${props.experiment}_${i}`} className="recipe_bar_phase tooltip" data-tooltip={dtt} style={s} > 
                  <span className="recipe_bar_phase_days">{ph.days}</span> 
                  <span className="recipe_bar_phase_type"> {ph.type} </span>
                </div>)
              }
          }
      }
      return ( 
        <>
        {renderExpReadingTags()}
        {renderTimestamps()}
        {/* <div style={ { width: `${ completionPercentage }%` } } className="recipe_horizontal_line"></div> */}
        <div className="recipe_bar"> 
          {phases} 
        </div>
        {renderModal()}
        </>
      )
    }
  };

  /*
  Input from: render()
  Outputs to: Screen
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Renders the entire RecipeBar modal
  */
  return (
    render()
  );

}

export default RecipeBar;