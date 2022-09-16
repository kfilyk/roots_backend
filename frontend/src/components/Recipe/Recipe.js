import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import menu_icon from "../../img/menu_icon.png"
import RecipeBar from "./RecipeBar"

const RecipeList = () => {
  //List of all recipes
  const [recipeList, setRecipeList] = useState([]);

  //List of all phases
  const [phaseList, setPhaseList] = useState([]);

  //Used to show a recipe JSON given a recipe id
  const [recipeJSON, setRecipeJSON] = useState({
    show: false,
    name: null,
    recipe_id: -1,
    json: {}
  })


  // initial phase object state prior to add/edit
  const initPhaseModal = {
    id: -1,
    days: null,
    waterings_per_day: null,
    watering_duration: null,
    blue_intensity: 99,
    red_intensity: 99,
    white_intensity: 99,
    lights_on_hours: null,
    type: "",
  }
  
  //Used to create a new phase
  const [phaseModal, setPhaseModal] = useState(initPhaseModal)
  const [selectedPhase, setSelectedPhase] = useState(1);

  //Used to add and edit a recipe
  const [recipeModal, setRecipeModal] = useState({
      show: false,
      add: true,
      name: null,
      phase1: initPhaseModal,
      phase2: null,
      phase3: null,
      phase4: null,
      phase5: null,
      phase6: null,
      phase7: null,
      phase8: null,
      phase9: null,
      phase10: null,
    }
  );


  /*
  Input from: phase
  Outputs to: renderCreatePhase()
  Created by: Stella T 08/31/2022
  Last Edit: Stella T 08/31/2022
  Purpose: Makes an API call to create a new phase according to phase variable
  */

  /*
  async function addPhase(e) {
    console.log("DD: ", phase)
    const result = await axios
      .post(`/api/phases/`, 
        { 
            type: phase.type,
            days: phase.days,
            waterings_per_day: phase.waterings_per_day,
            watering_duration: phase.watering_duration,
            blue_intensity: phase.blue_intensity,
            red_intensity: phase.red_intensity,
            white_intensity: phase.white_intensity,
            lights_on_hours: phase.lights_on_hours
        });
    if(result.status === 201 || result.status === 200){
      setPhaseList([...phaseList, result.data])
    }
  };
  */

  /*
  Input from: None
  Outputs to: recipeList
  Created by: Kelvin F @ 08/26/2022
  Last Edit: Kelvin F @ 08/26/2022
  Purpose: Fetches all recipe objects
  */
  async function fetchRecipes() {
    const result = await axios(
      '/api/recipes/',
    );
    setRecipeList(result.data)
  } 

  /*
  Input from: None
  Outputs to: phaseList; recipeList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Upon page load, it runs once and gets all phases and recipes
  */
  useEffect(() => {
    fetchPhases();
    fetchRecipes();
  }, []);

  /*
    Input from: phaseModal
    Outputs to: recipeModal
    Created by: Kelvin F @ 09/15/2022
    Last Edit: Kelvin F @ 09/15/2022
    Purpose: on change to PhaseModal, 
  */
  useEffect(() => {
    console.log(phaseModal)
    setRecipeModal({...recipeModal, ["phase"+selectedPhase]:phaseModal})

  }, [phaseModal]);

  /*
  Input from: None
  Outputs to: phaseList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Fetches all phase objects
  */
  async function fetchPhases() {
    const result = await axios(
      '/api/phases/',
    );
    setPhaseList(result.data)
  } 

  /*
  Input from: recipeList's item.id in return()
  Outputs to: return()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Makes an API call to delete a recipe from the database.
  At the moment, this does not work as intended because of foreign key restraints to the Phase Table. See models.py
  */
  async function deleteEntry(id) {
    await axios.delete(`/api/recipes/${id}/`);
    setRecipeList(recipeList.filter(recipe => recipe.id !== id))
  }

  /*
  Input from: recipe
  Outputs to: submitRecipeModal()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Calculates the total days of recipe based on summation of phase days
  */
  function countDays() {
    let days = 0;
    for(let i = 1; i<=10; i++) {
      if (recipeModal["phase"+i] !== null) {
        days += phaseList.find(phase => phase.id === parseInt(recipeModal["phase"+i])).days
      }
    }
    recipeModal.days = days;
  }

  /*
  Input from: submitRecipeModal()
  Outputs to: recipeList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Makes an API call to create a recipe in the database.
  */
  async function addRecipe(e) {
    const result = await axios
      .post(`/api/recipes/`, recipeModal);
      setRecipeList(recipeList => [...recipeList, result.data])
  };

  /*
  Input from: submitRecipeModal()
  Outputs to: recipeList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Makes an API call to edit a recipe in the database.
  */
  async function editRecipe(e) {
    const result = await axios
      .patch(`/api/recipes/${recipeModal.id}/`, recipeModal)
      .catch((err) => console.log("Error during edit recipe: ", err))

    const index = recipeList.findIndex(r => r.id === recipeModal.id);
    const updatedItem = result.data
    setRecipeList([
      ...recipeList.slice(0, index),
      updatedItem,
      ...recipeList.slice(index + 1)
    ])
  };

  /*
  Input from: showJSON()
  Outputs to: recipeJSON
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Makes an API call to create a recipe in the database.
  */
  async function getRecipeJSON(id) {
    const result = await axios
      .post(`/api/recipes/get_JSON/`, {recipe_id: id});
      setRecipeJSON({recipe_id: id, show: true, json: result.data})
  };

  /*
  Input from: return()
  Outputs to: modal, recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Determines whether modal to be opened is for adding or editing a recipe
  */
  function openModal(r){
    // if no item passed, we are adding a new one
    if (r === null){
      setRecipeModal({...recipeModal, add: true, show: true})
    } else {
      r['add']= false;
      r['show']= true;
      setRecipeModal(r)
    }
  }
  
  /*
  Input from: return()
  Outputs to: modal, recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Verifies recipe constraints (need recipe name + min. 1 phase); calculates total recipe day then makes API call to create recipe
  */

  function submitRecipeModal(close){
    if(recipeModal.name === null || recipeModal.name === ""){
      alert("Please provide a recipe name.")
      return
    } else if(recipeModal.phase1 === null) {
      alert("Recipe must have at least 1 phase.")
      return
    }

    for(let i = 1; i <= recipeModal.phases; i++){
      let phase = `phase${i}`
      if(recipeModal[phase] === null){
        alert(`Phase ${i} cannot be null`)
        return
      }
    }
    countDays();
    if(recipeModal.add) {
      addRecipe()
    } else {
      editRecipe()
    }
    close();
  }

  /*
  Input from: return()
  Outputs to: modal, recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Upon closing the modal, modal is hidden and recipe state is reset. 
  */
 
  function closeModal(){
    setRecipeModal({
      show: false,
      name: null,
      days: 0,
      phase1: null,
      phase2: null,
      phase3: null,
      phase4: null,
      phase5: null,
      phase6: null,
      phase7: null,
      phase8: null,
      phase9: null,
      phase10: null,
    })
  }

  /*
  Input from: renderPhaseSelection()
  Outputs to: renderPhaseSelection()
  Created by: Kelvin F @ 09/12/2022
  Last Edit: Kelvin F @ 09/12/2022
  Purpose: First, set button focus as 'active' for the selected phase of the ten phases
  */
  function changePhaseFocus(e, i){
    if (selectedPhase !== i){
        Array.from(document.querySelectorAll('.phase_selection')).forEach((el) => el.classList.remove('phase_selection_active'));
        e.currentTarget.classList.toggle('phase_selection_active');
        if(recipeModal["phase"+i] === null) {
          setPhaseModal(initPhaseModal)
        } else {
          setPhaseModal(recipeModal["phase"+i])
        }
        setSelectedPhase(i)
    }
}

    /*
  Input from: recipe
  Outputs to: renderRecipeModal()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Generates a dropdown of all phases to select from to build/edit a recipe
  */
  function renderPhaseSelection(){
    let phase_selection = [];

    for(let i = 1; i<=10; i++) {

      if(i===1 || (recipeModal['phase'+(i-1)] !== null && recipeModal['phase'+(i-1)]?.type !== "")) {
        phase_selection.push(
          <button key={i} className={i===1 ? 'form-row phase_selection phase_selection_active': 'form-row phase_selection'} onClick={(e) => { changePhaseFocus(e, i) }}> 
            <select className="form_row" value={recipeModal['phase'+i]?.type} onChange={(e) => setPhaseModal({...phaseModal, type: e.target.value})} >
              <option value=""></option>
              <option value="Germination">Germination</option>
              <option value="Seedling">Seedling</option>
              <option value="Vegetative">Vegetative</option>
              <option value="Flowering">Flowering</option>
              <option value="Harvest">Harvest</option>
              <option value="Other">Other</option>
            </select>          
          </button>
        )
      } else {
        // when phase is deleted, if selectedPhase is
        recipeModal["phase"+i] = null
      }
    }
    return <div>{phase_selection}</div>;
  }

    /*
  Input from: phaseModal form object
  Outputs to: render()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Renders phaseModal to allow manipulation of a particular recipe phase
  */
  function renderPhaseModal(){
    return (
      <div className="modal_content">
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
      </div>
    )
  }

  /*
  Input from: renderPhaseSelection(); renderCreatePhase()
  Outputs to: return()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Generates modal for add/edit recipe
  */

  function renderRecipeModal(){
    return (
      <Popup open={recipeModal.show} onClose={() => closeModal()} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
              <div className="modal_body" onClick={e => e.stopPropagation()}>
                <div className="modal_content">
                            
                  <div className="form_row">
                    <div className='create-recipe-left'>
                      { recipeModal.add === true ? "Create Recipe" : "Edit Recipe" }
                      <input name="name" value={recipeModal.name || ""} placeholder="Name" onChange={(e) => setRecipeModal({...recipeModal, name: e.target.value})} />
                      {renderPhaseSelection()}
                    </div>
                    <div className='create-phase-right'>
                      {renderPhaseModal()}
                    </div>
                  </div>
                  <button className='save' onClick={() => {submitRecipeModal(close)}}>Save</button>
                </div>
              </div>
            </div>
            )}
      </Popup>
    )
  }


  
  /*
  Input from: return()
  Outputs to: return()
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Calls method that makes API call to get JSON form of recipe
  */
  function showJSON(id){
    getRecipeJSON(id)
  }

  /*
  Input from: recipeList; modal; recipeJSON
  Outputs to: Screen
  Created by: Stella T 08/29/2022
  Last Edit: Stella T 08/29/2022
  Purpose: Renders the entire Recipe page
  */
  return (
    <div>
      <button onClick={() => openModal(null)}>+</button>
      {recipeList.map(item => (

        <div key={ item.id } className="item" >
          <div className="object_container">
            <div className="object_top">
              <div className="object_description">
                <div className="bold_font">{item.name+" | "}<span className="normal_font">{item.days} Days</span></div>
              </div>

              
              <div className='object_actions'>
                <img className="menu_icon" src={menu_icon} alt="NO IMG!"/>
                <button onClick={() => openModal(item)}>EDIT</button>
                <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
                <button onClick={() => showJSON(item.id)}>SHOW JSON</button>
              </div>
            </div>
            <RecipeBar phaseList = {phaseList} recipe = {item} experiment={undefined} is_object={true} fetchPhases={fetchPhases}></RecipeBar> 
          </div>
        </div>
      ))}

      {renderRecipeModal()}

      <Popup open={recipeJSON.show} onClose={() => setRecipeJSON({...recipeJSON, show: false})} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
                <div className="modal_body" onClick={e => e.stopPropagation()}>
                <div className="modal_content">
                  <pre>{JSON.stringify(recipeJSON.json, null, 2) }</pre>
                  <button className='save' onClick={() => {navigator.clipboard.writeText(JSON.stringify(recipeJSON.json))}}>COPY</button>
                </div>
              </div>
            </div>
            )}
      </Popup>
    </div>
  );
}


export default RecipeList;