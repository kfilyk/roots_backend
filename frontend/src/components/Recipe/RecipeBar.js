import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./recipebar.css"
import Popup from "reactjs-popup";

const RecipeBar = (props) => {
  // we NEED this recipe state object, because the props is variably a recipe id OR a recipe object
  const [recipe, setRecipe] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [start_date, setStartDate] = useState(null);
  const [completion_percentage, setCompletionPercentage] = useState(0);
  const [exp_reading_dates, set_exp_reading_dates] = useState([])
  const [modal, setModal] = useState(false)
  const [experiment_reading, setExperimentReading] = useState({
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

  async function getRecipe(id) {
    const result = await axios(
      `/api/recipes/${id}/`,
    )
    .catch((err) => console.log(err))
    setRecipe(result.data)
  }

  async function getReadings(id) {
    const result = await axios.post(`/api/experimentreadings/exp_reading_dates/`,
    { 
      exp_id: id
    }).catch((err) => console.log(err))
    if (result && result.status === 200){
      set_exp_reading_dates(result.data)
    }
  }

  async function getSingleReading(id) {
    const result = await axios(
      `/api/experimentreadings/${id}`
    )
    .catch((err) => console.log(err))
    setExperimentReading(result.data)
  }

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

  useEffect(() => {
    if(typeof props.recipe === 'number') {
      getRecipe(props.recipe)
    } else {
      setRecipe(props.recipe)
    }  
  }, [props.recipe])
  
  useEffect(() => {
    if(recipe !== null && (typeof props.experiment !== 'undefined')) {
      let sd = new Date(props.experiment.start_date)
      sd.setDate(sd.getDate()+recipe.days)
      setEndDate(sd.getFullYear()+ "-"+(sd.getMonth()+1)+"-"+sd.getDate())
      calc_completion_percentage(props.experiment.day, recipe.days)
    }
  }, [props, recipe]); // useEffect runs when props OR recipe changes

  function PhaseStyle(type)  {
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

  async function show_exp_reading(id){
    await getSingleReading(id)
    setModal(true)
  }


  function render_exp_reading_tags(){
    if (exp_reading_dates !== undefined){
      let bars = []
      exp_reading_dates.map((er, index) => {
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

  function render_timestamps() {
    if(props.experiment){
      return (
        <div>
          <div className="recipe_bar_timestamps">
            <div className="recipe_bar_start_date" >{props.experiment.start_date.slice(0,10) + " | "+ props.recipe_name} </div>
            <div className="recipe_bar_end_date">{end_date} </div>
          </div> 
          <div>
            <div style={ { width: `${ completion_percentage }%` } } className="recipe_horizontal_line"></div>
          </div>
          {/* <div className="recipe_bar_timestamps">  */}

        </div>
      )
    }
  }

  function calc_completion_percentage(exp_days, recipe_days){
    let percent = Math.round(exp_days/recipe_days*100)
    if (percent > 100){
      percent = 100
    }
    setCompletionPercentage(percent)
  }

  function renderModal(){
    return (
        <Popup open={modal} onClose={() => setModal(false)} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
                <div className="modal_body_2"  onClick={e => e.stopPropagation()}>
                    <div className="modal_content">
                        <div className="exp_general">
                            <div className="exp_r_form_row">Reading Date: {experiment_reading.reading_date || "N/A"} </div>
                            <div className="exp_r_form_row">Electrical Conductance: {experiment_reading.electrical_conductance || "N/A"}</div>
                            <div className="exp_r_form_row">Reservoir PH: {experiment_reading.reservoir_ph || "N/A"}</div>
                            <div className="exp_r_form_row">Temperature: {experiment_reading.temperature || "N/A"}</div>
                            <div className="exp_r_form_row">Humidity: {experiment_reading.humidity || "N/A"}</div>
                            {experiment_reading.failed_pump ? <div className="experiment_reading_indicator">Failed Pump </div> : <></>}
                            {experiment_reading.flushed_reservoir ? <div className="experiment_reading_indicator">Flushed Reservoir</div>: <></>}
                            {experiment_reading.lost_power ? <div className="experiment_reading_indicator">Lost Power</div>: <></>}
                            {experiment_reading.raised_light ? <div className="experiment_reading_indicator">Raised Light</div>: <></>}
                            {experiment_reading.went_offline ? <div className="experiment_reading_indicator">Went Offline</div>: <></>}

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

  /* controls the width and flex of the phase elements in the recipe bar*/
  function render() {
    if(recipe === null ||  props.phaseList.length === 0 || typeof recipe === 'undefined') {
      return <div className="empty_object"> NO RECIPE ALLOCATED </div>;
    } else {
      let phases = []
      for(let i = 1; i <= 10; i++) {
          let ph = props.phaseList.filter(phase => phase.id === recipe["phase"+i])[0] ?? null
          if(ph !== null) {
              // allocate  size proportional to number of phase days
              let s = PhaseStyle(ph.type)
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
        {render_exp_reading_tags()}
        {render_timestamps()}
        {/* <div style={ { width: `${ completion_percentage }%` } } className="recipe_horizontal_line"></div> */}
        <div className="recipe_bar"> 
          {phases} 
        </div>
        {renderModal()}
        </>
      )
    }
  };

  return (
    render()
  );

}

export default RecipeBar;