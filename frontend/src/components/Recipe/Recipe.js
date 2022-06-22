import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"
import RecipeBar from "./RecipeBar"

const RecipeList = () => {
  const [recipe_list, setRecipeList] = useState([]);
  const [phase_list, setPhaseList] = useState([]);

  const [modal, setModal] = useState({
    show: false,
    add: true,
  })

  const [recipe, setRecipe] = useState(
    {
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
    }
  );

  async function fetchRecipes() {
    const result = await axios(
      '/api/recipes/',
    );

    setRecipeList(result.data)

    const result2 = await axios(
      '/api/phases/',
    );
    setPhaseList(result2.data)
  } 

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function deleteEntry(id) {
    await axios.delete(`/api/recipes/${id}/`);
    setRecipeList(recipe_list.filter(recipe => recipe.id !== id))
  }

  function countDays() {
    let days = 0;
    for(let i = 1; i<=10; i++) {
      if (recipe["phase"+i] !== null) {
        days += phase_list.find(phase => phase.id === recipe["phase"+i]).days
      }
    }
    recipe.days = days;
  }

  async function addRecipe(e) {
    countDays();
    
    const result = await axios
      .post(`/api/recipes/`, recipe);
      setRecipeList(recipe_list => [...recipe_list, result.data])
  };

  async function editRecipe(e) {
    countDays();
    await axios
      .patch(`/api/recipes/${recipe.id}/`, recipe).catch((err) => console.log(err));
    fetchRecipes();
  };

  function openModal(r){
    // if no item passed, we are adding a new one
    if (r === null){
      setModal({add: true, show: true})
    } else {
      setRecipe(r)
      setModal({add: false, show: true})
    }
  }
  
  function submitModal(close){
    if(recipe.name === null || recipe.name === ""){
      alert("Please provide a recipe name.")
      return
    } 

    for(let i = 1; i <= modal.phases; i++){
      let phase = `phase${i}`
      if(recipe[phase] === null){
        alert(`Phase ${i} cannot be null`)
        return
      }
    }
    if(modal.add) {
      addRecipe()
    } else {
      editRecipe()
    }
    close();
  }

  function closeModal(){
    setModal({...modal, show: false}) 
    setRecipe({
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

  function update_recipe(e){
    setRecipe({...recipe,  [e.target.name]: (e.target.value.length === 0 ? null: e.target.value)})
  }

  function render_phase_selection(){
    let phase_selection = [];
    for(let i = 1; i<=10; i++) {

      if(i===1 || recipe['phase'+(i-1)]!== null) {
        phase_selection.push(
          <div className='form-row'>
            <select name={"phase"+i} defaultValue={recipe["phase"+i]} onChange={(e)=>update_recipe(e)}>
              <option value={null}></option>
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
          </div>
        )
      }
    }
    return <div>{phase_selection}</div>;
  }

  function renderModal(){
    return (
      <>
        <div className="form_row">
          <input name="name" value={recipe.name || ""} placeholder="Name" onChange={(e) => setRecipe({...recipe, name: e.target.value})} />
        </div>
        <div className="form_row">
          {render_phase_selection()}
        </div>
      </>
    )
  }


  return (
    <div>

      {recipe_list.map(item => (
        <div key={ item.id } className="item" >
          <div className="object_container">
            <div className="object_top">
              <div className="object_description">
                <div className="object_name">{item.name}</div><div>{item.days} Days</div>
              </div>

              
              <div className='object_actions'>
                <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
                <button onClick={() => openModal(item)}>EDIT</button>
                <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
              </div>
            </div>
            <RecipeBar phase_list = {phase_list} recipe = {item} ></RecipeBar>
          </div>
        </div>
      ))}
      <button onClick={() => openModal(null)}>+</button>
      <Popup open={modal.show} onClose={() => closeModal()} modal nested>
            {(close) => (
            <div className="modal" onClick={close}>
                <div className="modal_body" onClick={e => e.stopPropagation()}>
                <div className="modal_type"> { modal.add === true ? "Create Recipe" : "Edit Recipe" } </div>
                <div className="modal_content">
                  {renderModal()}
                  <button className='save' onClick={() => {
                    submitModal(close)
                  }}>Save</button>
                </div>
              </div>
            </div>
            )}
        </Popup>
    </div>
  );
}


export default RecipeList;