import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import menu_icon from "../../img/menu_icon.png";
import RecipeBar from "./RecipeBar";

const RecipeList = () => {

  //List of all recipes
  const [recipeList, setRecipeList] = useState([]);

  //List of all phases
  const [phaseList, setPhaseList] = useState([]);

  //Used to show a recipe JSON given a recipe id
  const [recipeJSON, setRecipeJSON] = useState({
    show: false,
    json: {}
  })

  // initial phase object state prior to add/edit
  const initPhaseModal = {
    id: -1,
    days: 7,
    waterings_per_day: 1,
    watering_duration: 1,
    blue_intensity: 99,
    red_intensity: 99,
    white_intensity: 99,
    lights_on_hours: 16,
    type: "",
  }
  
  //Used to create a new phase
  const [phaseModal, setPhaseModal] = useState(initPhaseModal)
  const [selectedPhase, setSelectedPhase] = useState(1);

  //Used to add and edit a recipe

  const initRecipeModal = {
    id: -1,
    show: false,
    add: false,
    name: null,
    days: 0,
    phase1: initPhaseModal,
    phase2: initPhaseModal,
    phase3: initPhaseModal,
    phase4: initPhaseModal,
    phase5: initPhaseModal,
    phase6: initPhaseModal,
    phase7: initPhaseModal,
    phase8: initPhaseModal,
    phase9: initPhaseModal,
    phase10: initPhaseModal,
  }

  const [recipeModal, setRecipeModal] = useState(initRecipeModal);

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
  async function deleteRecipe(id) {
    await axios.post(`/api/recipes/delete/`, {id: id})
      .catch((err) => console.log("Error during delete recipe: ", err));
      fetchRecipes()
    }

  /*
  Input from: submitRecipeModal()
  Outputs to: recipeList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Makes an API call to create a recipe in the database.
  */
  async function addRecipe(e) {
    await axios.post(`/api/recipes/`, recipeModal)
      .catch((err) => console.log("Error during add recipe: ", err));
    fetchRecipes()
    fetchPhases()
  };

  /*
  Input from: submitRecipeModal()
  Outputs to: recipeList
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Makes an API call to edit a recipe in the database.
  */
  async function editRecipe(e) {
    await axios.post(`/api/recipes/edit/`, recipeModal)
      .catch((err) => console.log("Error during edit recipe: ", err))
    fetchRecipes()
    fetchPhases()
  };

  /*
  Input from: return()
  Outputs to: modal, recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Determines whether modal to be opened is for adding or editing a recipe
  */
  function openRecipeModal(recipe){
    // if no item passed, we are adding a new one
    if (recipe === null){
      setRecipeModal({...recipeModal, add: true, show: true})
    } else {
      let r = {};
      Object.assign(r, recipe)
      for(let i = 1; i<= 10; i++) {
        r['phase'+i] = phaseList.filter(phase => phase.id === r['phase'+i])[0] ?? initPhaseModal
      }
      r['add']= false;
      r['show']= true;
      setPhaseModal(r['phase1'])
      setRecipeModal(r)
    }
  }
  
  /*
  Input from: return()
  Outputs to: modal, recipe
  Created by: Kelvin F @ 09/16/2022
  Last Edit: Kelvin F @ 09/16/2022
  Purpose: Verifies recipe constraints (need recipe name + min. 1 phase); calculates total recipe day then makes API call to create recipe
  */
  function submitRecipeModal(close){
    if(recipeModal.name === null || recipeModal.name === ""){
      alert("Please provide a recipe name.")
      return
    } else if (recipeModal.phase1.type === "") {
      alert("Please provide at least one phase.")
      return
    }
    console.log(recipeModal.days)
    
    if (recipeModal.days !== 0) {
      if(recipeModal.add) {
        addRecipe()
      } else {
        editRecipe()
      }
      close();
    }
  }

  /*
  Input from: return()
  Outputs to: modal, recipe
  Created by: Kelvin F @ 08/31/2022
  Last Edit: Kelvin F @ 08/31/2022
  Purpose: Upon closing the modal, modal is hidden and recipe state is reset. 
  */
 
  function closeModal(){
    setRecipeModal(initRecipeModal)
    setPhaseModal(initPhaseModal)
    setSelectedPhase(1)
  }

  /*
  Input from: None
  Outputs to: phaseList; recipeList
  Created by: Kelvin F @ 09/15/2022
  Last Edit: Kelvin F @ 09/23/2022
  Purpose: Calculates the total days of recipe based on summation of phase days. Also appends any changes to phases to the final recipe modal
  */
  useEffect(() => {
    let r = {...recipeModal, ["phase"+selectedPhase]:phaseModal}
    let days = 0;
    for(let i = 1; i<=10; i++) {
      if (r["phase"+i].type !== "") {
        days += parseInt(r["phase"+i].days)
      } else {
        break
      }
    }
    r = {...r, days: days}
    setRecipeModal(r) // save the recipe's phase and total length in days whenever phase modal is changed
  }, [phaseModal]);

  /*
  Input from: renderPhaseSelection()
  Outputs to: renderPhaseSelection()
  Created by: Kelvin F @ 09/12/2022
  Last Edit: Kelvin F @ 09/12/2022
  Purpose: First, set button focus as 'active' for the selected phase of the ten phases. Then, given a new phase selection "i", save the old phase selection to the recipe and switch to new modal context
  */
  function changePhaseFocus(e, i){
    if (selectedPhase !== i){

      //console.log("SELECTED PHASE: ", selectedPhase)
      //console.log("NEW PHASE: ", i)
      Array.from(document.querySelectorAll('.phase_selection')).forEach((el) => el.classList.remove('selected'));
      e.currentTarget.classList.toggle('selected');
      //setRecipeModal({...recipeModal, ["phase"+selectedPhase]:phaseModal}) // save the recipe's phase when a different phase is selected
      setSelectedPhase(i)
      setPhaseModal(recipeModal["phase"+i])

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

      // only render the next phase selection form if the previous one has been given a specified type
      if(i===1 || recipeModal['phase'+(i-1)].type !== "") {
        phase_selection.push(
          <button key={i} className={i===1 ? 'row phase_selection selected': 'row phase_selection'} onClick={(e) => changePhaseFocus(e, i) }>{recipeModal['phase'+i].type ? recipeModal['phase'+i].type : "New Phase..." }</button>
        )
      } else {
        // when phase is deleted, if selectedPhase is
        recipeModal["phase"+i] = initPhaseModal
      }
    }
    return phase_selection;
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
      <>
          <div className="row"><select value={phaseModal.type} onChange={(e) => setPhaseModal({...phaseModal, type: e.target.value})} >
            <option value=""></option>
            <option value="Germination">Germination</option>
            <option value="Seedling">Seedling</option>
            <option value="Vegetative">Vegetative</option>
            <option value="Flowering">Flowering</option>
            <option value="Harvest">Harvest</option>
            <option value="Other">Other</option>
          </select>Phase </div>
          <div className="row"><input className="phase-modal-numerical-input" value={phaseModal.days} min="1" step="1" type="number" onKeyPress= {(e) => {if(e.charCode === 45) {e.preventDefault()}}} onChange={(e) => setPhaseModal({...phaseModal, days: e.target.value})} /> Days</div>
          <div className="row"><input className="phase-modal-numerical-input" value={phaseModal.waterings_per_day} min="0" step="1" type="number" onKeyPress= {(e) => {if(e.charCode === 45) {e.preventDefault()}}} onChange={(e) => setPhaseModal({...phaseModal, waterings_per_day: e.target.value})} /> Waterings Per Day</div>
          <div className="row"><input className="phase-modal-numerical-input" value={phaseModal.watering_duration} min="0" step="1" type="number" onKeyPress= {(e) => {if(e.charCode === 45) {e.preventDefault()}}} onChange={(e) => setPhaseModal({...phaseModal, watering_duration: e.target.value})} /> Watering Duration (Min)</div>
          <div className="row"><input className="phase-modal-numerical-input" value={phaseModal.lights_on_hours} min="0" step="1" type="number" onKeyPress= {(e) => {if(e.charCode === 45) {e.preventDefault()}}} onChange={(e) => setPhaseModal({...phaseModal, lights_on_hours: e.target.value})} />Lights On Hours</div>
          <div className="row">
            <input value={phaseModal.blue_intensity} id="blue_intensity_slider" className="slider" type="range" min={0} max={99} onChange={(e) => setPhaseModal({...phaseModal, blue_intensity: e.target.value})}/>
            <div className='intensity_text_overlay'>{phaseModal.blue_intensity}</div>
          </div>
          <div className="row">
            <input value={phaseModal.red_intensity} id="red_intensity_slider" className="slider" type="range" min={0} max={99} onChange={(e) => setPhaseModal({...phaseModal, red_intensity: e.target.value})} />
            <div className='intensity_text_overlay'>{phaseModal.red_intensity}</div>
          </div>                    
          <div className="row">
            <input value={phaseModal.white_intensity}  id="white_intensity_slider" className="slider" type="range" min={0} max={99} onChange={(e) => setPhaseModal({...phaseModal, white_intensity: e.target.value})} />
            <div className='intensity_text_overlay'>{phaseModal.white_intensity}</div>
          </div>   
      </>
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
              <div className="modal-body" onClick={e => e.stopPropagation()}>
                  <div className="row">
                    <div className='modal-left'>
                      <div className="row">
                        { recipeModal.add === true ? "Create " : "Edit " }
                        <input name="name" size="12" value={recipeModal.name || ""} placeholder="Recipe Name" onChange={(e) => setRecipeModal({...recipeModal, name: e.target.value})} />
                      </div>
                      {renderPhaseSelection()}
                    </div>
                    <div className='modal-right'>
                      {renderPhaseModal()}
                    </div>
                  </div>
                  <button className='save' onClick={() => {submitRecipeModal(close)}}>Save</button>
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
  Purpose: Makes an API call to get JSON form of recipe.
  */
  async function showRecipeJSON(id) {
    const result = await axios
      .post(`/api/recipes/get_JSON/`, {recipe_id: id});
      setRecipeJSON({recipe_id: id, show: true, json: result.data})
  };

  /*
  Input from: recipeList; modal; recipeJSON
  Outputs to: Screen
  Created by: Stella T 08/29/2022
  Last Edit: Stella T 08/29/2022
  Purpose: Renders the entire Recipe page
  */
  return (
    <div>
      <button onClick={() => openRecipeModal(null)}>+</button>
      {recipeList.map(item => (

        <div key={ item.id } className="item" >
          <div className="object_container">
            <div className="object_top">
              <div className="object_description">
                <div className="bold_font">{item.name+" | "}<span className="normal_font">{item.days} Days</span></div>
              </div>
              
              <div className='object_actions'>
                <img className="menu_icon" src={menu_icon} alt="NO IMG!"/>
                <button onClick={() => openRecipeModal(item)}>EDIT</button>
                <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteRecipe(item.id) }}> DELETE </button>
                <button onClick={() => showRecipeJSON(item.id)}>SHOW JSON</button>
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
              <div className="modal-body" onClick={e => e.stopPropagation()}>
                  <pre>{JSON.stringify(recipeJSON.json, null, 2) }</pre>
                  <button className='save' onClick={() => {navigator.clipboard.writeText(JSON.stringify(recipeJSON.json))}}>COPY</button>
              </div>
            </div>
            )}
      </Popup>
    </div>
  );
}


export default RecipeList;