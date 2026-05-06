<h1 align="center">Google Maps Clone</h1>

![image alt](https://github.com/biancalyonsj/google-maps-clone/blob/db7ea5d960fd3ff98467f63b4d527b04a19ac24e/maps-demo.jpg)

<p>Built a Google Maps style navigation user interface using JavaScript and the Mapbox API, featuring real-time geolocation and route directions</p>

<h2>Concepts Learned</h2>
<h3>Geolocation & Browser APIs</h3>
<li>Integrated the Geolocation API to retrieve the user’s current position with high accuracy</li>
<li>Handled asynchronous location requests with success and error callbacks for robust UX</li>
<li>Implemented graceful fallbacks by defaulting to a predefined location when geolocation fails or is denied</li>

<h3>Map Rendering & Third-Party API Integration</h3>
<li>Leveraged the Mapbox GL JS library to render an interactive, zoomable map interface</li>
<li>Configured map initialization with dynamic centering, zoom levels, and map styles</li>
<li>Integrated Mapbox Directions to enable real-time route generation and navigation controls</li>

<h3>Asynchronous JavaScript & Event Flow</h3>
<li>Managed asynchronous control flow between geolocation retrieval and map initialization</li>
<li>Ensured map rendering occurs only after location data is resolved</li>
<li>Handled error states cleanly without blocking application functionality</li>
