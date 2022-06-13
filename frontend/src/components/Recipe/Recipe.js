import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import vertical_menu_icon from "../../img/vertical_menu_icon.png"

const RecipeList = () => {
  const [recipe_list, setRecipeList] = useState([]);
  const [phase_list, setPhaseList] = useState([]);
  const [value, setValue] = useState("default");


  const [modal, setModal] = useState({
    show: true,
    // show: false,
    add: false
  })


  const [recipe, setRecipe] = useState(
    {
      name: null,
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

  const [show_phase, set_show_phase] = useState(
    {
      max_phase: 1,
      phase1: true,
      phase2: false,
      phase3: false,
      phase4: false,
      phase5: false,
      phase6: false,
      phase7: false,
      phase8: false,
      phase9: false,
      phase10:  false,
    }
  );

  async function fetchData() {
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
    fetchData();
  }, []);

  async function deleteEntry(id) {
    await axios.delete(`/api/recipes/${id}/`);
    setRecipeList(recipe_list.filter(recipe => recipe.id !== id))
  }

  async function addEntry(e) {
    const result = await axios
      .post(`/api/recipes/`, 
        { 
            name: recipe.name,
            phase1: recipe.phase1,
            phase2: recipe.phase2,
            phase3: recipe.phase3,
            phase4: recipe.phase4,
            phase5: recipe.phase5,
            phase6: recipe.phase6,
            phase7: recipe.phase7,
            phase8: recipe.phase8,
            phase9: recipe.phase9,
            phase10: recipe.phase10,
        });
        setRecipeList(recipe_list => [...recipe_list, result.data])
  };

  async function editEntry(e) {
    await axios
      .patch(`/api/recipes/${recipe.id}/`, 
      { 
          name: recipe.name,
          phase1: recipe.phase1,
          phase2: recipe.phase2,
          phase3: recipe.phase3,
          phase4: recipe.phase4,
          phase5: recipe.phase5,
          phase6: recipe.phase6,
          phase7: recipe.phase7,
          phase8: recipe.phase8,
          phase9: recipe.phase9,
          phase10: recipe.phase10,
      }).catch((err) => console.log(err));
      fetchData();
  };

  function openModal(r){
    if (r === null ){
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

    for(let i = 1; i <= show_phase.max_phase; i++){
      let phase = `phase${i}`
      if(recipe[phase] === null){
        alert(`Phase ${i} cannot be null`)
        return
      }
    }

    console.log(recipe)
    close();
  }

  function closeModal(){
    setModal({...modal, show: false}) 
    setRecipe({
      name: null,
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
    let phase_position = e.target.name
    let new_value = e.target.value
    setRecipe({...recipe,  [phase_position]: parseInt(new_value)})
  }

  function render_phase_selection(){
    return (
      <div>
        <div className={show_phase.phase1 ? 'form-row' : 'hidden'}>
            <label>Phase 1:</label>
            <select name="phase1" value={recipe.phase1} onChange={(e)=>update_recipe(e)}>
            <option value={null} hidden disabled>PICK A PHASE</option>
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
        </div>
        <div className={show_phase.phase2 ? 'form-row' : 'hidden'}>
            <label>Phase 2:</label>
            <select name="phase2" value={recipe.phase2} onChange={(e)=>update_recipe(e)}>
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
        </div>
        <div className={show_phase.phase3 ? 'form-row' : 'hidden'}>
            <label>Phase 3:</label>
            <select name="phase3" value={recipe.phase3} onChange={(e)=>update_recipe(e)}>
              <option value={"default"} disabled hidden></option>
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
        </div>
        <div className={show_phase.phase4 ? 'form-row' : 'hidden'}>
            <label>Phase 4:</label>
            <select name="phase4" value={recipe.phase4} onChange={(e)=>update_recipe(e)}>
              <option value={"default"} disabled hidden></option>
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
        </div>
        <div className={show_phase.phase5 ? 'form-row' : 'hidden'}>
            <label>Phase 5:</label>
            <select name="phase5" value={recipe.phase5} onChange={(e)=>update_recipe(e)}>
              <option value={"default"} disabled hidden></option>
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
        </div>
        <div className={show_phase.phase6 ? 'form-row' : 'hidden'}>
            <label>Phase 6:</label>
            <select name="phase6" value={recipe.phase6} onChange={(e)=>update_recipe(e)}>
              <option value={"default"} disabled hidden></option>
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
        </div>
        <div className={show_phase.phase7 ? 'form-row' : 'hidden'}>
            <label>Phase 7:</label>
            <select name="phase7" value={recipe.phase7} onChange={(e)=>update_recipe(e)}>
              <option value={"default"} disabled hidden></option>
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
        </div>
        <div className={show_phase.phase8 ? 'form-row' : 'hidden'}>
            <label>Phase 8:</label>
            <select name="phase8" value={recipe.phase8} onChange={(e)=>update_recipe(e)}>
              <option value={"default"} disabled hidden></option>
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
        </div>
        <div className={show_phase.phase9 ? 'form-row' : 'hidden'}>
            <label>Phase 9:</label>
            <select name="phase9" value={recipe.phase9} onChange={(e)=>update_recipe(e)}>
              <option value={"default"} disabled hidden></option>
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
        </div>
        <div className={show_phase.phase10 ? 'form-row' : 'hidden'}>
            <label>Phase 10:</label>
            <select name="phase10" value={recipe.phase10} onChange={(e)=>update_recipe(e)}>
              <option value={"default"} disabled hidden></option>
              {phase_list.map((phase) => ( <option key={phase.id} value={phase.id}>{phase.name} | ({phase.type})</option>))}
            </select>
        </div>
      </div>
    )
  }

  function change_max(increase){
    let new_max = increase ? show_phase.max_phase + 1 : show_phase.max_phase - 1
    let max_phase = increase ? `phase${new_max}` : `phase${show_phase.max_phase}`
    if (increase && new_max <= 10){
      set_show_phase({...show_phase, max_phase: new_max, [max_phase]: true})
    } else if (!increase && new_max >=1){
      set_show_phase({...show_phase, max_phase: new_max, [max_phase]: false})
      setRecipe({...recipe, [show_phase.max_phase]: null})
    }
    console.log("HERE ", max_phase, recipe)
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
        <div className="form_row">
          <button onClick={()=>change_max(true)}>+</button>
          <button onClick={()=>change_max(false)}>-</button>
        </div>

      </>
    )
  }


  return (
    <div>

      {recipe_list.map(item => (
        <div key={ item.id } className="item" >
          <div className="object_container">
            <div className="object_description">
              <div className="object_name">{item.name}</div>
              <div>{item.supplier}</div>
            </div>
            <div className="object_content">                          
              
            </div>
            <div className='object_actions'>
              <img className="vertical_menu_icon" src={vertical_menu_icon} alt="NO IMG!"/>
              <button onClick={() => openModal(item)}>EDIT</button>
              <button onClick={() => { if (window.confirm(`You are about to delete ${item.id}, ${item.name}`)) deleteEntry(item.id) }}> DELETE </button>
            </div>
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