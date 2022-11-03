import React, { useState, useEffect } from 'react';
import "./recipebar.css"
import white_light_icon from "../../img/white_light_icon.png"
import blue_light_icon from "../../img/blue_light_icon.png"
import red_light_icon from "../../img/red_light_icon.png"
import water_icon from "../../img/water_icon.png"
import ExperimentReading from "../Experiment/ExperimentReading"

const RecipeBar = (props) => {
  // we NEED this recipe state object, because the props is variably a recipe id OR a recipe object
  // Recipe we're creating the progress bar for
  const [recipe, setRecipe] = useState(null);

   //based on today's date and the recipe's start + end date, calculate completion as a percentage
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const [experimentReading, setExperimentReading] = useState({
    show: false,
    add: true,
  })

 
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
    setRecipe(props?.recipe)

  }, []); // [] causes useEffect to only happen ONCE after initial render - will not be called as a result of any other change
  
  /*
  Input from: props, recipe
  Outputs to: completionPercentage
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Upon props or recipe change, updates the completion percentage, start date and end date.
  */
  useEffect(() => {
    setRecipe(props?.recipe)  
    let sd = new Date(props?.experiment?.start_date)
    let ed = new Date(props?.experiment?.end_date)
    setCompletionPercentage(Math.floor(((Date.now() - sd)/(ed-sd))*100))
  }, [props]); // useEffect runs when props OR recipe changes

  
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
  Input from: experimentReadingList
  Outputs to: render()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 09/03/2022
  Purpose: Given a list of exp reading dates, calculates where they should be placed on timeline, and returns positions accordingly
  */
  function renderExpReadingTags(){
    if (props.experimentReadingList !== undefined){
      let tags = []
      let start = new Date(props.experiment.start_date)
      let end = new Date(props.experiment.end_date)

      props.experimentReadingList.map((er, index) => {
        let date = new Date(er.reading_date)
        let date_string = date.toISOString().substring(5,10)

        let style = Math.floor(( ( date - start ) / ( end - start ) ) * 100) + "%";

        tags.push(
            <a key={`${er.id}_${index}`} onClick={() => {
              setExperimentReading({...experimentReading, ...er, show: true, add:false}); 
              if(er.experiment !== props.selectedExperiment) { 
                (props.podList.length > 0) ? props.setSelectedPod(props.podList[0].id) : props.setSelectedPod(-1); 
              } 
              props.setSelectedExperimentReading(er.id); 
              props.setSelectedExperiment(er.experiment);
            }} style={{left: `calc(${style})`, zIndex:3}} className={props.selectedExperimentReading === er.id && props.selectedExperiment === props.experiment.id ? "tooltip exp_reading_indicator_selected": "tooltip exp_reading_indicator"} data-tooltip={date_string}>▼</a>
        )
      })
      if(props.experiment.status === 0){
        let date = new Date()
        let date_string = date.toISOString().substring(5,10)

        let style = Math.floor(( ( Date.now() - start ) / ( end - start ) ) * 100) + "%";
        tags.push(
          <a key={`new_er`} onClick={() => { 
              setExperimentReading({show: true, add:true}); 
              (props.podList.length > 0) ? props.setSelectedPod(props.podList[0].id) : props.setSelectedPod(-1); 
              props.setSelectedExperiment(props.experiment.id);
              props.setSelectedExperimentReading(-1);
            }
          } style={{left: `calc(${style})`, color: '#99ff44', fontSize: '25px', fontWeight:'bold', zIndex:2}} className={props.selectedExperimentReading === -1 && props.selectedExperiment ===props.experiment.id ? "tooltip exp_reading_indicator_new": "tooltip exp_reading_indicator"} data-tooltip={date_string+" - NEW"}>●</a>
        )
      }
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
          <div className="recipe_bar_timestamps">
            <div className="recipe_bar_start_date" >{props.experiment.start_date.slice(0,10) + " | "+ props.recipe_name} </div>
            <div className="recipe_bar_end_date">{props.experiment.end_date.slice(0,10)} </div>
          </div> 
          <div className="recipe_bar_progress_line">
            <div style={ { width: `${ completionPercentage }%` } } className="recipe_bar_progress_line_filled"></div>
            {renderExpReadingTags()}
          </div>
        </>
      )
    }
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
          / day for {ph.watering_duration} minute(s)
        </div>
        <div className="phase_lighting">
          <div className="phase-light"> <img src={blue_light_icon} alt="Blue Light"></img> <div className="light_intensity" >{ph.blue_intensity}</div> </div>
          <div className="phase-light"> <img src={red_light_icon} alt="Red Light" ></img> <div className="light_intensity">{ph.red_intensity}</div> </div>
          <div className="phase-light"> <img src={white_light_icon} alt="White Light"></img> <div className="light_intensity">{ph.white_intensity}</div> </div>
          , { ph.lights_on_hours } hours / day
        </div>
      </div>
    )
  }

  /*
  Input from: phaseList, renderExpReadingTags(); renderTimestamps(); phases; experimentReading();
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
                phases.push(<div key={`${props.experiment}_${i}`} className="recipe_bar_phase" style={s}> 
                  <span className="recipe_bar_phase_days">{ph.days}</span> 
                  <span className="recipe_bar_phase_name bold_font"> {ph.type} </span>
                  {renderPhaseDetails(ph)}
                </div>)
              } else {
                phases.push(<div key={`${props.experiment}_${i}`} className="recipe_bar_phase" style={s} > 
                  <span className="recipe_bar_phase_days">{ph.days}</span> 
                  <span className="recipe_bar_phase_name"> {ph.type} </span>
                  {props.selectedExperiment === props.experiment.id ? renderPhaseDetails(ph) : <></> }
                </div>)
              }
          }
      }
      return ( 
        <div className="recipe_bar">
          {!props.is_object && props.selectedExperiment === props?.experiment?.id ? <ExperimentReading experiment={props.experiment} experimentReading={experimentReading} podReadingList = {props.podReadingList.filter(pr => pr.experiment_reading === experimentReading.id)} setExperimentReading={setExperimentReading} getExperimentReadings={props.getExperimentReadings} getPodReadings={props.getPodReadings} podList = {props.podList} selectedPod = {props.selectedPod} setSelectedPod = {props.setSelectedPod} setSelectedExperimentReading={props.setSelectedExperimentReading} setSelectedExperiment = {props.setSelectedExperiment}/>: <></>}
          {renderTimestamps()}
          <div className="recipe_bar_phases"> 
            {phases} 
          </div>
        </div>
      )
    }
  };

  /*
  Input from: render()
  Outputs to: Screen
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Renders the entire RecipeBar object
  */
  return (
    render()
  );

}

export default RecipeBar;