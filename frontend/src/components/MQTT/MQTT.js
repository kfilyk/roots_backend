import React, { useEffect, useState, } from 'react';
import axios from "axios";
import Popup from 'reactjs-popup';

/*
OVERALL FILE PURPOSE: 
Renders module for the generic MQTT Client
*/

const MQTT = (props) => {
    //Sets the default command parameters
    const [mqtt, setMqtt] = useState({
        show: false,
        id: 0, // COMMAND ID, NOT DEVICE ID. 
        device: null,
        // device: -1,
        hour: 0,
        minute: 0,
        cycle: 0,
        stage: 0,
        timezone: "Etc/GMT-7",
        response: {},
        recipe_name: "recipe.json",
        recipe_json: "",
        env: "roots"
    });


    useEffect(() => {
        window.addEventListener('keypress', e => {
        if(e.key === 'm' || e.key === 'M') {
          setMqtt({...mqtt, show:true});
        }
      });
    }, []);

    /*
    Input from: command, renderCommandParameters(), renderCommand()
    Outputs to: command
    Created by: Stella T 08/29/2022
    Last Edit: Stella T 08/29/2022
    Purpose: Makes API call to backend to send command to device
    */
    async function send_command(e){
        const result = await axios
          .post(`/mqtt/`, 
            { 
                command: mqtt.id,
                device: mqtt.device,
                env: mqtt.env,
                parameters: mqtt
            });
        setMqtt({...mqtt, response: result.data})
    }

    /*
    Input from: renderCommand()
    Outputs to: command
    Created by: Stella T 08/29/2022
    Last Edit: Stella T 08/29/2022
    Purpose: Based on which command is selected, the appropriate inputs are shown. 
    For example, command 0 (Get Device State) doesn't need any parameters but command 7 (change timezone) does.
    */
    function renderCommandParameters(id){
        switch(true) {
            case id === -1:
                return (<textarea type="text" placeholder="Command...." onChange={(e) => setMqtt({...mqtt})} />)

            case id === 3:
                return(
                    <div>
                        <input type="text" placeholder="recipe_name.json" onChange={(e) => setMqtt({...mqtt, recipe_name: e.target.value})} />
                        <textarea placeholder="..." value={mqtt.recipe_json} onChange={(e) => setMqtt({...mqtt, recipe_json: e.target.value})} rows="10"></textarea>
                    </div>
                )
            case id === 11:
                return(
                    <div>
                        <div>
                            Hour (0 to 23):
                            <input type="number" value={mqtt.hour} min={0} max={23} onChange={(e) => {setMqtt({...mqtt, hour: e.target.value})}} />
                        </div>
                        <div>
                            Minute (0 to 59):
                            <input type="number" value={mqtt.minute} min={0} max={59} onChange={(e) => {setMqtt({...mqtt, minute: e.target.value})}} />
                        </div>
                    </div>
                )
            case id === 14:
                return(
                    <div>
                        <div>
                            Stage:
                            <input type="number" value={mqtt.stage} min={0} onChange={(e) => {setMqtt({...mqtt, stage: e.target.value})}} />
                        </div>
                        <div>
                            Cycle:
                            <input type="number" value={mqtt.cycle} min={0} onChange={(e) => {setMqtt({...mqtt, cycle: e.target.value})}} />
                        </div>
                    </div>
            )
            case id === 16:
                return(
                    <div>
                        <p>Recipe name (spelling, capitalization must be exact. must include .json at the end)</p>
                        <input type="text" value={mqtt.recipe_name} placeholder="Recipe Name" onChange={(e) => setMqtt({...mqtt, recipe_name: e.target.value})} />
                    </div>
                )
            default:
                return
        } 
        
    }

    /*
    Input from: renderCommand()
    Outputs to: Screen
    Created by: Stella T 08/29/2022
    Last Edit: Stella T 08/29/2022
    Purpose: Renders the entire generic MQTT Client module
    */
    return (
        <Popup open={mqtt.show} onClose={(() => {setMqtt({...mqtt, show:false })}) } modal nested>
            {(close) => (

                <div className="modal" onClick={close}>
                    <div className="modal-body"  onClick={e => e.stopPropagation()}>
                        <div className="row">
                            <div className="modal-left">
                                <input type="text" value={mqtt.device} placeholder="Device ID" onChange={(e) => setMqtt({...mqtt, device: e.target.value})} />
                                <select value={mqtt.env} onChange={(e) => setMqtt({...mqtt, env: e.target.value})} >
                                    <option value="qa">QA</option>
                                    <option value="prod">PROD</option>
                                    <option value="dev">DEV</option>
                                    <option value="roots">ROOTS</option>
                                </select>
                                <select value={mqtt.id} onChange={(e) => setMqtt({...mqtt, id: parseInt(e.target.value)})} >
                                    <option value="-1">Custom...</option>
                                    <option value="0">Get Device State</option>
                                    {/* <option value="1">Get Device Logs</option> */}
                                    <option value="3">Add Recipe</option>
                                    <option value="11">Change Start Time</option>
                                    <option value="12">Trigger OTA</option>
                                    <option value="14">Change Stage and Cycle</option>
                                    <option value="15">Get Recipe List</option>
                                    <option value="16">Trigger Recipe by Name</option>
                                </select>
                                

                            </div>
                            <div className='modal-right'>
                                {renderCommandParameters(mqtt.id)}
                                <textarea placeholder="Response... " value={JSON.stringify(mqtt.response, null, 2) ==="{}" ? "": JSON.stringify(mqtt.response, null, 2)}></textarea>
                            </div>
                        </div>
                        <button className='save' onClick={(e) => { send_command(e)}}>Send</button>
                    </div> 
                </div> 
            )}
        </Popup>
      );
}

export default MQTT;