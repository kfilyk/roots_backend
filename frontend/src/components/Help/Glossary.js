import React, { useState, useEffect, useRef } from 'react';
import "./help.css"

const Glossary = () => {
    function renderPlantAnatomy(){
      return (
        <div>
            <h2>Plant Anatomy</h2>
            <table style={{width: '100%'}}>
                <tbody>
                <tr>
                    <th style={{width: '15%'}}>Plant Part</th>
                    <th style={{width: '50%'}}>Plant Photo</th>
                    <th style={{width: '35%'}}>Definition</th>
                </tr>
                <tr>
                    <td>Cotyledon or Seed Leaves</td>
                    <td><img src={require("./assets/cotyledon.png")} alt="more"/></td>
                    <td>The first leaves that emerge during germination.  Leaves develop inside the embryo of a seed. The number of cotyledon leaves varies between flowering and non flowering plants. </td>
                </tr>
                <tr>
                    <td>Basal Growing Point or Crown</td>
                    <td>Need photo reference</td>
                    <td>The base point for vegetative growth of a plant. Easiest to identify using the embryonic cotyledon leaves. This is where the main stem of the plant grows and produces new tissue.</td>
                </tr>
                <tr>
                    <td>Seedling</td>
                    <td><img src={require("./assets/seedling.png")} alt="more"/></td>
                    <td>A life phase for a plant that starts once the first true leaves emerge and ends when the plant has *roughly* reached ¼-½  its expected size at full maturity. Note this is an arbitrary term and used mostly for commercial purposes of selling young plants. </td>
                </tr>
                <tr>
                    <td>True Leaves</td>
                    <td><img src={require("./assets/true_leaves.png")} alt="more"/></td>
                    <td>Leaves of a plant that emerge after the cotyledons. </td>
                </tr>
                <tr>
                    <td>Main Stem</td>
                    <td><img src={require("./assets/main_stem.png")} alt="more"/></td>
                    <td>Primary structural support of a plant from which other branches and leaves develop from. </td>
                </tr>
                <tr>
                    <td>Node</td>
                    <td><img src={require("./assets/nodes.png")} alt="more"/></td>
                    <td>Point along a stem where branches of leaves develop. A large volume of nodes leads to a bushy, dense plant. Not all plants possess nodes (example lettuce)</td>
                </tr>
                <tr>
                    <td>Internode</td>
                    <td><img src={require("./assets/internode.png")} alt="more"/></td>
                    <td>The distance between nodes along the stem of a plant. Longer internode distance makes plants appear tall and bare. Not all plants possess internodes (example lettuce)</td>
                </tr>
                <tr>
                    <td>Tendril</td>
                    <td><img src={require("./assets/tendril.png")} alt="more"/></td>
                    <td>Thin, thread like specialized leaves that are used for climbing, structural support and expansion of growth. Common examples include cucumbers and peas.</td>
                </tr>
                <tr>
                    <td>Bud</td>
                    <td><img src={require("./assets/bud.png")} alt="more"/></td>
                    <td>Swelling from a node of a stem from which a flower, branch or leaf will develop.</td>
                </tr>
                <tr>
                    <td>Flower</td>
                    <td><img src={require("./assets/flower.png")} alt="more"/></td>
                    <td>Reproductive organ of a plant. Contains male (stamen) and female (pistil) parts. Once pollinated/fertilized it will develop into a fruit. </td>
                </tr>
                <tr>
                    <td>Roots</td>
                    <td><img src={require("./assets/roots.png")} alt="more"/></td>
                    <td>Specialized organ of a plant used for anchorage, water absorption, nutrient absorption and nutrient storage. Can be fleshy and webbing (fibrous) or deep and linear (taproot).</td>
                </tr>
                <tr>
                    <td>Runner</td>
                    <td><img src={require("./assets/runner.png")} alt="more"/></td>
                    <td>Also called a stolon, it is a specialized shoot that grows horizontally along the growing substrate and gives rise to new roots or shoots. </td>
                </tr>
                </tbody>
            </table>
        </div>
      )
    }

    function renderPlantCare() {
        return (
            <div>
                <h2>Plant Care</h2>
                <div>
                    <h3>Plant Types</h3>
                    <table style={{width: '100%'}}>
                        <tbody>
                        <tr>
                            <th style={{width: '20%'}}>Type</th>
                            <th style={{width: '40%'}}>Examples</th>
                            <th style={{width: '40%'}}>Definition</th>
                        </tr>
                        <tr>
                            <td>Annual</td>
                            <td>Basil, anise, dill, chervil, nasturtium, calendula, tomatoes, peppers and fennel.</td>
                            <td>Plants that are short-lived and survive for only one growing cycle or season. They need to be replanted every year. </td>
                        </tr>
                        <tr>
                            <td>Perennial</td>
                            <td>Chives, cilantro, lavender,  chamomile, marjoram, tarragon, catnip, mint, and echinacea.</td>
                            <td>Plants that last longer and regrow every Spring or simply are a plant that grows for more than two years. This term is also used distinguishing plants with minimal woody growth from trees that are also considered perennial plants.</td>
                        </tr>
                        <tr>
                            <td>Biennial</td>
                            <td>Parsley, carrot, onion, beets, cabbage, celery, leeks, parsnips, turnips, and ginger.</td>
                            <td>These plants need a full two growing seasons to complete their life-cycle. In the first year, they produce roots, stems and leaves; in the second year, they produce flowers, fruit, seeds and then die. Several biennial plants are grown like they are annuals if the grower does not need to save their seeds.</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>Growing Condition</h3>
                    <table style={{width: '100%'}}>
                        <tbody>
                        <tr>
                            <th style={{width: '10%'}}>Item</th>
                            <th style={{width: '20%'}}>Defintion</th>
                            <th style={{width: '35%'}}>Optimal Range</th>
                            <th style={{width: '35%'}}></th>
                        </tr>
                        <tr>
                            <td><a href="https://docs.google.com/document/d/1Z5pOLgjcHhQ-8BU_D9Qn1H8EMXWEIJHCIh56qgMw6wc/edit">Watering</a></td>
                            <td>Water's role in plants is essential for the movement of nutrients and solutes from the roots to the shoots. </td>
                            <td>For optimal growth, use filtered or distilled water at room temperature to avoid plant growth issues. If you don't have access to either, you can leave tap water in the sun for 12-24 hours or run it through a filtration system. Learn more about it here.</td>
                        </tr>
                        <tr>
                            <td><a href="https://docs.google.com/document/d/1O3Km0Ekw3v5I5pi5o-_CUGG29QHLhmN7E4CT2W4HXzo/edit?usp=sharing">Temperature</a></td>
                            <td>Temperature impacts plants by determining the rate at which chemical reactions (ie growth) occur. </td>
                            <td>Optimal range will depend on the plant type/  where it grows naturally. Too warm will lead to water loss via transpiration in the leaves or denaturation (death) of proteins within the cells. Too cold will slow growth or kill the plant.</td>
                        </tr>
                        <tr>
                            <td><a href="https://docs.google.com/document/d/1O3Km0Ekw3v5I5pi5o-_CUGG29QHLhmN7E4CT2W4HXzo/edit?usp=sharing">Humidity</a></td>
                            <td>Humidity influences the rate of transpiration (water loss) from plant leaves.</td>
                            <td>Optimal range will depend on the plant type/ where it grows naturally. Can be controlled by using a diffuser and humidifiers.</td>
                        </tr>
                        <tr>
                            <td>Reverse Osmosis</td>
                            <td>A water purification process that removes contaminants from unfiltered water by pushing them through a semi-permeable barrier.</td>
                        </tr>
                        <tr>
                            <td>Photoperiod</td>
                            <td>The amount of hours a plant is exposed to light within a 24 hour cycle. Plays a critical role in plant development and hormone signaling. </td>
                            <td>The photoperiod will range throughout the plant's growth to mimic the changing of a season. Some flowering plants are defined as short day plants (require less than 12hrs to flower), long day plants (require more than 12hrs to flower) or day neutral (flowering is not influenced by photoperiod). </td>
                        </tr>
                        <tr>
                            <td>Photo Intensity</td>
                            <td>The intensity of wavelengths of light received by a plant. Normally measured in PPFD or DLI units. </td>
                            <td>The intensity will range throughout the plant's growth to mimic the changing of a season. Typically young plants require less intense light because they have smaller leaf surface area for light absorption. </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>pH</td>
                            <td>EC</td>
                            <td>Water Temperature</td>
                        </tr>
                        <tr>
                            <td>What is it?<img src={require("./assets/ph.png")} alt="more"/></td>
                            <td>When measuring the pH (Potential Hydrogen Ions) of a solution, you're determining the number of hydrogen ions. pH strips test the acidity and alkalinity of the water in your reservoir. This is important as water from home taps are often treated in a way that alters the natural pH balance. Drinking water typically ranges from 7-8.5.</td>
                            <td>The EC levels indicate the amount of minerals in the water so pure or distilled water has no electrical conductivity as it contains no minerals. When minerals are added or are naturally present, the dissolved salts allow the water to conduct electricity. The EC will be high when there is a higher concentration of salts.</td>
                            <td>Our garden's use a type of deep water culture hydroponic watering system, which means that the plants' roots are almost entirely immersed into the reservoir's water - whether it be cold, warm or hot. We want to maintain a consistent water temperature</td>
                        </tr>
                        <tr>
                            <td>Why is it important?</td>
                            <td>pH is important to understand when growing plants because it impacts the dispersal and availability of nutrients. An imbalance in pH can block the plants ability to uptake nutrients or in extreme cases can become toxic to the plant! </td>
                            <td>EC allows the plants to absorb and retain more water. If the measurement remains the same, the plants are using as much water as nutrients; if EC goes down, the plants are uptaking more nutrients than water; and if the EC goes up, the plants are using more nutrients and may be overfed - making them at risk of tip-burn and slow growth.</td>
                            <td>By knowing your water's temperature, the plants will be able to thrive. As the temperature rises, the water is not able to carry as much oxygen in the water for the plants' roots. The plants may take up more water during hotter periods. The plants are also at risk of developing mold, mildew, stunted or slow growth and prematurely flowering or bolting.</td>
                        </tr>
                        <tr>
                            <td>Cotyledon</td>
                            <td>Cotyledon</td>
                            <td>Cotyledon</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    function renderOptimalPlantGrowth() {
        return (
            <div>
                <h2>What is Optimal for Plant Growth?</h2>
                <div>
                    <table style={{width: '100%'}}>
                        <tbody>
                        <tr>
                            <th style={{width: '30%'}}>Pod Pack</th>
                            <th style={{width: '10%'}}>pH</th>
                            <th style={{width: '30%'}}>EC</th>
                            <th style={{width: '30%'}}>Water Temperature (C & F)</th>
                        </tr>
                        <tr>
                            <td>Basil Starter Pack</td>
                            <td>6-6.5</td>
                            <td>1-1.5</td>
                            <td>18-23 C (65-75F)</td>
                        </tr>
                        <tr>
                            <td>Mixed Salad Greens</td>
                            <td>6-7.5</td>
                            <td>1-2</td>
                            <td>15-23 (60-75F)</td>
                        </tr>
                        <tr>
                            <td>Gourmet Italian Herbs</td>
                            <td>6-6.5</td>
                            <td>1-1.5</td>
                            <td>15-23 (60-75F)</td>
                        </tr>
                        <tr>
                            <td>Cocktail Mix</td>
                            <td>6-7.5</td>
                            <td>1-2.5</td>
                            <td>18-23 C  (65-75F)</td>
                        </tr>
                        <tr>
                            <td>Asian Herbs</td>
                            <td>6-6.5</td>
                            <td>1-1.5</td>
                            <td>18-23 C (65-75F)</td>
                        </tr>
                        <tr>
                            <td>Mediterranean Herbs</td>
                            <td>6-7.5</td>
                            <td>1-2</td>
                            <td>15-23 (60-75F)</td>
                        </tr>
                        <tr>
                            <td>Winter Sweets</td>
                            <td>6-7.5</td>
                            <td>1-2.5</td>
                            <td>15-23 (60-75F)</td>
                        </tr>
                        <tr>
                            <td>Winter Greens</td>
                            <td>6-7</td>
                            <td>1-1.5</td>
                            <td>15-23 (60-75F)</td>
                        </tr>
                        <tr>
                            <td>Flower Power Salad</td>
                            <td>7-7.5</td>
                            <td>0.5-1</td>
                            <td>18-23 C  (65-75F)</td>
                        </tr>
                        <tr>
                            <td>Baking with Blossoms </td>
                            <td>6.5-7.5 </td>
                            <td>0.5-1 </td>
                            <td>18-23 C (65-75F) </td>
                        </tr>
                        <tr>
                            <td>Blossom Bouquet</td>
                            <td>6.5-7.5</td>
                            <td>0.5-1</td>
                            <td>20-25 C (70-80F)</td>
                        </tr>
                        <tr>
                            <td>Name That Flavour</td>
                            <td>6-7.5</td>
                            <td>1-2</td>
                            <td>15-23 (60-75F)</td>
                        </tr>
                        <tr>
                            <td>Wok the World</td>
                            <td>6-7.5</td>
                            <td>1-2.5</td>
                            <td>15-23 (60-75F)</td>
                        </tr>
                        <tr>
                            <td>My Cup of Tea</td>
                            <td>6.5-7.5</td>
                            <td>0.5-1</td>
                            <td>18-23 C  (65-75F)</td>
                        </tr>
                        <tr>
                            <td>You Had Me at Tomatoes</td>
                            <td>5.5-6.5</td>
                            <td>1-2.5</td>
                            <td>20-25 C (70-80F)</td>
                        </tr>
                        </tbody>
                        </table>
                </div>
                <div>
                    <h3>Germination Techniques:</h3>
                    <table style={{width: '100%'}}>
                        <tbody>
                        <tr>
                            <th style={{width: '20%'}}>Technique</th>
                            <th style={{width: '30%'}}>Plant Examples</th>
                            <th style={{width: '50%'}}>Definition/Purpose</th>
                        </tr>
                        <tr>
                            <td>Cold Stratification</td>
                            <td>Lavender, sage, hops, asparagus, echinacea, yarrow, black-eyed susans, and rosemary.</td>
                            <td>This is a technique used to increase the germination rate of some seeds by mimicking a cold (0 degrees Celsius or colder)  winter environment as a dormant period. This is needed for some plants and most trees that would naturally need time in the ground over a cold winter in order to germinate.</td>
                        </tr>
                        <tr>
                            <td>Heat Mat</td>
                            <td>Tomatoes, peppers, melons, cucumbers, strawberries and all woody and perennial flowers.</td>
                            <td>Many seeds benefit or need to be started indoors in order to survive past the seedlings phase of the plant's growth before being transplanted outside in the spring. These plants also have much higher germinate rates when the soil or substrate is warm and not just high air temperatures.</td>
                        </tr>
                        <tr>
                            <td>Scarification</td>
                            <td>Beans, okra, nasturtium, tomatoes and morning glory.</td>
                            <td>Larger and hard seeds will have increased germination rates when there is a chemical or mechanical scarification treatment that is then proceeded with a stratification period. Scarification is a germination technique that opens or weakens the outer coating of a seed for germination to happen. Most growers place seeds in a bag with coarse sand and shake for one minute, soak seeds in water overnight then place seeds in a paper towel in a bag in the fridge overnight.</td>
                        </tr>
                        <tr>
                            <td>Light Exposure</td>
                            <td>a) Seed that don't need light: Asparagus, Beans, Beets. <br></br><br></br> b) Seeds that need light (most flowers): Alyssum, Lettuce, Ageratum, Peppers</td>
                            <td>All seeds need light once they've germinated for the seedling to grow into a healthy plant. However, light is not always necessary for the germination of most plants, some seeds are more successful when they germinate in absolute darkness and others in continuous light. In short, some seeds, like flowers, benefit from light during germination, while for most seeds it does not make a difference if light is present before the seedling phase. <br></br><br></br>
                                a) Seeds that don't need light:
                                These need to be sown deeper in the soil or substrate to block out UV rays that could inhibit germination. <br></br><br></br>
                                b) Seeds that need light:
                                These do not need to be covered when sowing them. 
                            </td>
                        </tr>
                        <tr>
                            <td>Germination Dome</td>
                            <td>Most seeds, most especially helpful for: Tomatoes, sweet peppers, hot peppers, melons, cucumbers, etc.</td>
                            <td>A germination dome ensures the seed is receiving the ideal environment for germination, such as the retention of higher temperature and moisture (humidity) levels that will increase the germination rate. A germination dome is not necessary, but rather speeds up the process of a seed germinating and encourages more seeds to germinate.</td>
                        </tr>
                        </tbody>
                        </table>
                </div>
                <div>
                    <h3>Growing Tips</h3>
                    <table style={{width: '100%'}}>
                        <tbody>
                        <tr>
                            <th style={{width: '20%'}}>Technique</th>
                            <th style={{width: '40%'}}>Photo</th>
                            <th style={{width: '40%'}}>Definition</th>
                        </tr>
                        <tr>
                            <td>Thinning</td>
                            <td><img src={require("./assets/thinning.png")} alt="more"/></td>
                            <td>Removing excess plants from the pod to improve the growth of central plants. Thinning should happen during the seedling stage. The entire plant (including its roots) must be removed. <a href="https://www.youtube.com/watch?v=W_E50PJNd5s">How to thin seedlings</a></td>
                        </tr>
                        <tr>
                            <td>Pollination</td>
                            <td><img src={require("./assets/pollination.png")} alt="more"/></td>
                            <td>Fertilizing plants via the transfer of pollen between flowers. Can occur via wind, insect dispersal, hand dispersal, etc. Some plants will have male and female flowers that need to be cross pollinated while others are unisexual. If pollination does not occur, no fruit will be produced.<a href="https://www.google.com/search?q=how+to+pollinate+cucumbers+indoors&oq=how+to+pollinate+cucumbers&aqs=chrome.0.0i512l3j0i20i263i512j0i512l3.3535j0j9&sourceid=chrome&ie=UTF-8#kpvalbx=_yrmGYoHmEJHO0PEPm6a64As16">How to Pollinate </a></td>
                        </tr>
                        <tr>
                            <td>Deadheading</td>
                            <td><img src={require("./assets/deadheading.png")} alt="more"/></td>
                            <td>Removal of unfertilized flowers. This is done to promote the growth of new blooms. Can be done by cutting the base of the flower with scissors once flowers show signs of wilting, damage or death.</td>
                        </tr>
                        <tr>
                            <td>Distance b/w LED & Plant</td>
                            <td>Photo of 2 inches away from canopy</td>
                            <td>Having your plants grow too close to the LED light can be intense and cause damage to the leaves.  Make room for your plants to grow uninterrupted by extending the Byte's adjustable neck.</td>
                        </tr>
                        <tr>
                            <td>Topping</td>
                            <td><img src={require("./assets/topping.png")} alt="more"/></td>
                            <td>Removing new growth in  a plant to encourage bushy, compact growth. This can be done from the seedling phase to encourage bushy growth or at the budding phase of a flowering plant to encourage allocation of resources towards flower/fruit production. Typically done with plants that grow larger than the byte  peppers, peas, beans, etc.</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>Harvesting Techniques:</h3>
                    <table style={{width: '100%'}}>
                        <tbody>
                        <tr>
                            <th style={{width: '20%'}}>Technique</th>
                            <th style={{width: '40%'}}>Photo & Plant Examples</th>
                            <th style={{width: '40%'}}>Definition</th>
                        </tr>
                        <tr>
                            <td>Topping</td>
                            <td><img src={require("./assets/topping.png")} alt="more"/></td>
                            <td>This harvesting technique is for small portions or harvests and is only meant for <u>nodal plants</u>. Cut above the node to encourage bush-like growth instead of tree-like growth, This will result in increased future yields, because the plant will have two main stems instead of one to grow new foliage and leaves on. Furthermore, this technique prevents pests and diseases, because you may be removing diseased or pest-infected parts of the plant making room for healthy new growth. By removing foliage, more light and ventilation will reduce moist and humid conditions for the plant, which is the leading cause of disease.</td>
                        </tr>
                        <tr>
                            <td>Single-Leaf, Flower or Fruit</td>
                            <td><img src={require("./assets/single-leaf.png")} alt="more"/></td>
                            <td>This harvesting technique is  for small portions or harvests  and is for snipping off a few outer leaves, flowers or fruits when they are ready. By removing ⅓ of the plant's <u>outer leaves</u>, this will help the plant focus its resources on growing more leaves from the inner growing point or crown. This concept is the same for flowers and fruits, except the location of them on the plant is less relevant. A plant may not need the entire crop harvested and if you only need a small portion, this will prevent food waste!</td>
                        </tr>
                        <tr>
                            <td>Entire Plant</td>
                            <td>All plants!<br></br><br></br>a) Plants that form a head:Romaine, Cabbage, Radicchio, Broccoli. <img src={require("./assets/harvest_lettuce.png")} alt="more"/><br></br><br></br>b) Cut-and-come-again: Cut-lettuce, Arugula, Dill, Cilantro<img src={require("./assets/harvest.png")} alt="more"/></td>
                            <td>This harvesting technique is for large portions or harvests of any plant - with and without nodes. No matter what type of plant, all plants have a time in their life, where they have a peak time to harvest for the largest harvest possible.<br></br><br></br>a) Form a head:<br></br>For plants like romaine that form a “head”, they need to be harvested below the base of the plant. This method means that there will be no regrowth.<br></br><br></br>b) Cut-and-come-again:<br></br>For plants that do not form a head and can have multiple regrowths if cut 2-3 inches above the crown or cotyledons.</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    function renderTools(){
        return (
            <div>
            <div>
                <h2>Tools: </h2>
                <h3>Data Collection:</h3>
                <img src={require("./assets/water-meter.png")} alt="more"/>
                <ul>
                    <li>Water meter</li>
                    <li>Air stone</li>
                    <li>Air pump</li>
                    <li>Caliper</li>
                    <li>Water</li>
                    <li>Water</li>
                    <li>Water</li>
                </ul>
            </div>
            <div>
                <h3>Growing Medium:</h3>
                <ul>
                    <li>Eazy Plug Pods</li>
                </ul>
            </div>
            </div>
        )
    }

    function renderPlantIssues(){
        return (
            <div>
            <div>
                <h2>Plant Issues: </h2>
                <h3>Growing Recipes:</h3>
                <ul>
                    <li><a href="https://docs.google.com/document/d/1Sg1qbGpr0KJ8riVMhZlc0QKH-V7VRIeUEzBko--81Xk/edit?usp=sharing">Pests and Bugs</a>(The app content uses these blog posts for describing the below bugs)</li>
                    <ul>
                        <li>Aphid</li>
                        <li>Earwig</li>
                        <li>Fruit Fly</li>
                        <li>Fungus Gnat</li>
                        <li>Spider Mite</li>
                        <li>Thrip</li>
                        <li>White Fly</li>
                        <li>Stink Bug</li>
                    </ul>
                </ul>
            </div>
            <div>
                <h3>Dieases & more:</h3>
                <ul>
                    <li><a href="https://docs.google.com/document/d/1RrkB6MpeVV3LvA8EReKSElKw7KWUEUbQg0RnuSyr_Jk/edit?usp=sharing">Algae and Mold</a>(The app content uses this blog post for explaining diseases)</li>
                    <li>Chlorosis</li>
                    <li>Scorching</li>
                    <li>Deformation</li>
                    <li>Etc.</li>
                </ul>
            </div>
            </div>
        )
    }

    function renderPlantRecipes(){
        return (
            <div>
                <h2>Plant Recipes: </h2>
            <div>
                <h3>Growing Recipes</h3>
                <ul>
                    <li>Lighting</li>
                    <ul>
                        <li>Cold vs. warm LEDS</li>
                        <table style={{width: '100%'}}>
                            <tbody>
                            <tr>
                                <th style={{width: '33%'}}>Spectrum Percentage</th>
                                <th style={{width: '33%'}}>Cool White Light</th>
                                <th style={{width: '34%'}}>Warm White Light</th>
                            </tr>
                            <tr>
                                <td>Red</td>
                                <td>20%</td>
                                <td>53%</td>
                            </tr>
                            <tr>
                                <td>Far Red</td>
                                <td>1%</td>
                                <td>11%</td>
                            </tr>
                            <tr>
                                <td>Blue</td>
                                <td>26%</td>
                                <td>71%</td>
                            </tr>
                            <tr>
                                <td>Green</td>
                                <td>50%</td>
                                <td>28%</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>= Compact growth with dark leaf pigmentation</td>
                                <td>= Larger leaf area and less intense pigmentation</td>
                            </tr>
                            </tbody>
                        </table>
                        <li>Spectrum: Wavelength/color of light (AVA byte = Red, Blue, Cool White)  </li>
                        <li>PPFD: Photosynthetic photon flux density, a measure of the light intensity in μmol/s. M²</li>
                        <li>Intensity: percentage of light capacity of LED light.</li>
                        <li>Distance b/w plant canopy and LEDs</li>
                        <li>Photoperiod: Hours of light plant experiences per 24 hours. </li>
                        <li>Light intrusion: Can be light from a neighboring window or sunlight that impacts the photoperiod of the plant. Can also be used to describe the impact of LED lights on customer experience.</li>
                        <li>Plant Life Phase: Way to categorize the lifespan of a plant for the sake of adjusting recipes to cater to the unique needs of a plant at different growth periods. Includes Germination, Seedling,Vegetative, Flowering, Fruiting.</li>
                    </ul>
                    <li>Lighting</li>
                    <ul>
                        <li>Duration: Length of watering per cycle (mins)</li>
                        <li>Cycles: Number of times the pump will go off in 24 hours</li>
                        <li>Temperature of water in reservoir</li>
                    </ul>
                </ul>
            </div>
            <div>
                <h3>Nutrient Recipes</h3>
                <ul>
                    <li>Macronutrients (N-P-K)</li>
                    <li>Micronutrients (Ca, Mg, B, Zn, Mn, Fe, Cu etc)</li>
                    <li>Liquid: Solutions added to the reservoir weekly</li>
                    <li>Solid: Nutrients added to the reservoir or in pods.</li>
                    <li>Ec: Measure of concentration of particles in water</li>
                    <li>pH: measure of acidity or basicity of water.</li>
                    <li>Current Nutrient Recipes in Pods: <a href="https://royalbrinkman.com/crop-care/fixed-fertilizers/osmocote/osmocote-bloom-12-07-18-2-3-25kg-150300975">Osmocote Bloom</a></li>
                </ul>
                <img src={require("./assets/oxide_table.jpg")} alt="more"/>
            </div>
            </div>
        )
    }

    function renderAccessories(){
        return (
            <div>
            <div>
                <h2>Accessories </h2>
                <table style={{width: '100%'}}>
                        <tbody>
                        <tr>
                            <th style={{width: '20%'}}>Type</th>
                            <th style={{width: '40%'}}>Photo</th>
                            <th style={{width: '40%'}}>Definition</th>
                        </tr>
                        <tr>
                            <td>xxxxx</td>
                            <td>xxxxx</td>
                            <td>xxxxx</td>
                        </tr>
                        <tr>
                            <td>xxxxx</td>
                            <td>xxxxx</td>
                            <td>xxxxx</td>
                        </tr>
                        <tr>
                            <td>xxxxx</td>
                            <td>xxxxx</td>
                            <td>xxxxx</td>
                        </tr>
                        </tbody>
                    </table>
            </div>
            <div>
                <h3>Stake Trellis:</h3>
                <ul>
                    <li>xxxxxx</li>
                    <li>xxxxxx</li>
                    <li>xxxxxx</li>
                </ul>
            </div>
            <div>
                <h3>Climbing Trellis:</h3>
                <ul>
                    <li>xxxxxx</li>
                    <li>xxxxxx</li>
                    <li>xxxxxx</li>
                </ul>
            </div>
            </div>
        )
    }

    function renderGlossary() {
        return (
            <div>
            {renderPlantAnatomy()}
            {renderPlantCare()}
            {renderOptimalPlantGrowth()}
            {renderTools()}
            {renderPlantIssues()}
            {renderPlantRecipes()}
            {renderAccessories()}
            </div>
        )
    }

    return (
        <div>
            {renderGlossary()}
        </div>
    );
}

export default Glossary