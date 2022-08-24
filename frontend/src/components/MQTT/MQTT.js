import React, { useState, } from 'react';
import axios from "axios";
import "./mqtt.css"

const MQTT = () => {
    const [command, set_command] = useState({
        show: false,
        id: 0,
        device: "6372",
        // device: -1,
        hour: 0,
        minute: 0,
        cycle: 0,
        stage: 0,
        timezone: "Etc/GMT-7",
        response: {},
        recipe_name: "null.json",
        env: "qa"
    });

    async function send_command(e){
        const result = await axios
          .post(`/mqtt/`, 
            { 
                command: command.id,
                device: command.device,
                env: command.env,
                parameters: command
            });
        set_command({...command, response: result.data})
    }

    function renderCommandParameters(id){
        switch(true) {
            case id === 7:
                return(
                    <div>
                        <div>
                            Select Timezone
                            <select value={command.timezone} onChange={(e) => set_command({...command, timezone: e.target.value})} >
                                <option value="Etc/GMT-12">Etc/GMT+12</option>
                                <option value="Etc/GMT-11">Etc/GMT+11</option>
                                <option value="Etc/GMT-10">Etc/GMT+10</option>
                                <option value="Etc/GMT-9">Etc/GMT+9</option>
                                <option value="Etc/GMT-8">Etc/GMT+8</option>
                                <option value="Etc/GMT-7">Etc/GMT+7</option>
                                <option value="Etc/GMT-6">Etc/GMT+6</option>
                                <option value="Etc/GMT-5">Etc/GMT+5</option>
                                <option value="Etc/GMT-4">Etc/GMT+4</option>
                                <option value="Etc/GMT-3">Etc/GMT+3</option>
                                <option value="Etc/GMT-2">Etc/GMT+2</option>
                                <option value="Etc/GMT-1">Etc/GMT+1</option>
                                <option value="Etc/GMT">Etc/GMT</option>
                                <option value="Etc/GMT+1">Etc/GMT-1</option>
                                <option value="Etc/GMT+2">Etc/GMT-2</option>
                                <option value="Etc/GMT+3">Etc/GMT-3</option>
                                <option value="Etc/GMT+4">Etc/GMT-4</option>
                                <option value="Etc/GMT+5">Etc/GMT-5</option>
                                <option value="Etc/GMT+6">Etc/GMT-6</option>
                                <option value="Etc/GMT+7">Etc/GMT-7</option>
                                <option value="Etc/GMT+8">Etc/GMT-8</option>
                                <option value="Etc/GMT+9">Etc/GMT-9</option>
                                <option value="Etc/GMT+10">Etc/GMT-10</option>
                                <option value="Etc/GMT+11">Etc/GMT-11</option>
                                <option value="Etc/GMT+12">Etc/GMT-12</option>
                            </select>
                        </div>
                        <div>
                        </div>
                    </div>
                )
            case id === 11:
                return(
                    <div>
                        <div>
                            Hour (0 to 23):
                            <input type="number" value={command.hour} min={0} max={23} onChange={(e) => {set_command({...command, hour: e.target.value})}} />
                        </div>
                        <div>
                            Minute (0 to 59):
                            <input type="number" value={command.minute} min={0} max={59} onChange={(e) => {set_command({...command, minute: e.target.value})}} />
                        </div>
                    </div>
                )
            case id === 14:
                return(
                    <div>
                        <div>
                            Stage:
                            <input type="number" value={command.stage} min={0} onChange={(e) => {set_command({...command, stage: e.target.value})}} />
                        </div>
                        <div>
                            Cycle:
                            <input type="number" value={command.cycle} min={0} onChange={(e) => {set_command({...command, cycle: e.target.value})}} />
                        </div>
                    </div>
            )
            case id === 16:
                return(
                    <div>
                        <p>Recipe name (spelling, capitalization must be exact. must include .json at the end)</p>
                        <input type="text" value={command.recipe_name} placeholder="Recipe Name" onChange={(e) => set_command({...command, recipe_name: e.target.value})} />
                    </div>
                )
            default:
                return
        } 
        
    }

    function renderCommand(){
        return (
                <div className="mainContainer">
                    <div className="leftContainer">
                        <input type="text" value={command.device} placeholder="Device ID" onChange={(e) => set_command({...command, device: e.target.value})} />
                        <select value={command.env} onChange={(e) => set_command({...command, env: e.target.value})} >
                            <option value="qa">QA</option>
                            <option value="prod">Prod</option>
                            <option value="dev">Dev</option>
                            <option value="roots">Roots</option>
                        </select>
                        <select value={command.id} onChange={(e) => set_command({...command, id: parseInt(e.target.value)})} >
                            <option value="0">Get Device State</option>
                            {/* <option value="1">Get Device Logs</option> */}
                            <option value="7">Change Timezone</option>
                            <option value="11">Change Start Time</option>
                            <option value="12">Trigger OTA</option>
                            <option value="14">Change Stage and Cycle</option>
                            <option value="15">Get Recipe List</option>
                            <option value="16">Trigger Recipe by Name</option>
                        </select>
                    {renderCommandParameters(command.id)}
                    <button className='save' onClick={(e) => {
                        send_command(e)
                    }}>Send Command</button>
                    </div>
                    <div className='rightContainer'>
                        Response: 
                        <pre>{JSON.stringify(command.response, null, 2) }</pre>
                        {/* <button className='save' onClick={() => {navigator.clipboard.writeText(JSON.stringify(command.response))}}>COPY RESPONSE</button> */}
                    </div>
                </div>
        )
    }

    return (
        <div>
            {renderCommand()}
        </div>
      );
}

export default MQTT