import React, { useState, useEffect, useRef } from 'react';
import "./help.css"

const Videos = () => {
    function renderVideos(){
        return (
            <div>
            <div>
                <h2>Video Shot List</h2>
                <table style={{width: '100%'}}>
                        <tbody>
                        <tr>
                            <th style={{width: '25%'}}>Category</th>
                            <th style={{width: '25%'}}>Video</th>
                            <th style={{width: '25%'}}>Shot Description</th>
                            <th style={{width: '25%'}}>Video Taken (date, which plants)</th>
                        </tr>
                        <tr>
                            <td>Growing Tips</td>
                            <td>Germination Dome Removal</td>
                            <td></td>
                            <td>x</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Pollination</td>
                            <td>
                                <ul>
                                    <li>Show how to ID female vs male flowers</li>
                                    <li>Explain what type of plants need help pollinating </li>
                                    <li>Demo of pollination</li>
                                </ul>
                            </td>
                            <td>Cucumbers (After six weeks of growth) - later</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Deadheading</td>
                            <td></td>
                            <td>Peppers/Cucumbers</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Deadheading</td>
                            <td> To deadhead your plant gently pull off old flowers that are wilted or decaying. Be careful not to damage or remove healthy flowers as these may still turn into fruit. </td>
                            <td>Tomatoes (flowers)</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Topping</td>
                            <td>
                                <ul>
                                    <li>What is it?</li>
                                    <li>Why do we do it?</li>
                                    <li>When should a plant be topped?</li>
                                    <li>Which plants should I top?</li>
                                    <li>How do I do it?</li>
                                </ul>
                            </td>
                            <td>X Peppers* See how they look on Friday might not be able to get this shot </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Raise LED</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Harvesting Techniques</td>
                            <td>Pruning</td>
                            <td></td>
                            <td>x</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Pruning Suckers</td>
                            <td>
                                These are small shoots that sprout out at the intersection of the main stem and branches of your tomato plant. 
                                <br></br><br></br>
                                Pruning suckers is only necessary once you notice early flower buds appearing on your plant. 
                                <br></br><br></br>
                                To prune suckers, use scissors to cut away the vertical shoot that appears at the base of a branch where it attaches to the stem. Look for this V and snip! 
                            </td>
                            <td>X Tomatoes (3 clips) - May 20, 2022</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Single-Leaf, Flower or Fruit</td>
                            <td></td>
                            <td>Need to do for fruiting</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Entire Pod</td>
                            <td></td>
                            <td>x</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Cut-and-come-again</td>
                            <td></td>
                            <td>x</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>xxxxx</td>
                            <td>xxxxx</td>
                            <td>xxxxx</td>
                        </tr>
                        <tr>
                            <td>How-To</td>
                            <td>How to add a trellis (stake only for now)</td>
                            <td></td>
                            <td>x</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>How to add nutrients</td>
                            <td></td>
                            <td>x</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>How to check pH (pH strips)</td>
                            <td></td>
                            <td>x</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>What to do if your water is not at optimal pH, EC?</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>How to check pH, EC and temp</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>How to add water</td>
                            <td>Remind them about not over filling</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>How to reconnect the pump</td>
                            <td></td>
                            <td>x</td>
                        </tr>
                        <tr>
                            <td>How to transplant</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>How to propagate a cutting</td>
                            <td></td>
                            <td>x</td>
                        </tr>
                        <tr>
                            <td>Informational</td>
                            <td>Plant Anatomy - Nodal Plants</td>
                            <td></td>
                            <td>x</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Plant Anatomy - Non-nodal plants</td>
                            <td></td>
                            <td>x</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Button LEDs </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Set Up</td>
                            <td>What is in the box?</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>How to set up your Byte for the first time - wifi pairing</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>How to set up your Byte for the first time - adding a pod pack</td>
                            <td></td>
                            <td></td>
                        </tr>
                        {/* <tr>
                            <td></td>
                            <td>xxxxxx</td>
                            <td></td>
                            <td>x</td>
                        </tr> */}
                        </tbody>
                    </table>
            </div>
            </div>
        )
    }

    function renderGlossary() {
        return (
            <div>
            {renderVideos()}
            </div>
        )
    }

    return (
        <div>
            {renderGlossary()}
        </div>
    );
}

export default Videos