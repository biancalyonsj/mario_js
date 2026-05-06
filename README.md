<h1 align="center">Super Mario Bros. Browser Game</h1>

![image alt](https://github.com/biancalyonsj/mario_js/blob/f91be6b78e3a5eed1a7f03ee513ce2b69febf527/mario_homescreen.jpg)

<p>Created a simple recreation of the classic game Super Mario Bros. using JavaScript</p>

<h2>Concepts Learned</h2>
<h3>DOM Manipulation & Browser APIs</h3>
<li>Leveraged the Document Object Model (DOM API) to dynamically create, update, and remove game elements in real time</li>
<li>Built reusable utilities for programmatic element creation and styling, improving code maintainability and scalability</li>
<li>Managed UI updates by synchronizing game state with the DOM (score, level, lives, and game-over screen)</li>
<li>Controlled element positioning using CSS positioning (relative / absolute) and inline styles for precise rendering within the game area</li>

<h3>Dynamic Rendering & UI Updates</h3>
<li>Implemented real-time UI updates using textContent and style manipulation to reflect game state changes</li>
<li>Dynamically rendered level layouts by iterating over structured data and generating DOM elements</li>
<li>Efficiently handled element lifecycle management using .remove() to clean up game objects and prevent DOM clutter</li>

<h3>Data-Driven UI Generation</h3>
<li>Generated game environments from structured configuration objects, enabling scalable level design</li>
<li>Used array iteration methods (e.g., forEach) to transform data into interactive UI elements</li>
<li>Separated data (level design) from rendering logic for improved flexibility and extensibility</li>

<h3>Asynchronous JavaScript & Animations</h3>
<li>Utilized setInterval to implement time-based animations (e.g., coin float and item drop mechanics)</li>
<li>Managed animation lifecycles with clearInterval to ensure performance and prevent memory leaks</li>
<li>Coordinated asynchronous behavior with game state for smooth user interactions</li>

<h3>Reusability & Code Organization</h3>
<li>Created helper functions (e.g., element factory utilities) to reduce repetition and enforce consistency</li>
<li>Structured code into logical sections (initialization, rendering, updates, input handling) for readability and maintainability</li>
