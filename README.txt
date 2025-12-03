Self-Driving Car in JavaScript
Credits: This project is based on an online course by Radu Mariescu‑Istodor. I followed and adapted his approach to learn and experiment with JavaScript and simple AI.

Motivation
I built this project as a way to learn more about JavaScript, basic physics, and simple AI concepts like neural networks and sensors. I wanted a hands‑on project where I could see the “brain” making decisions in real time and watch it improve over multiple runs.

Overview
This is a self‑driving car simulation in pure JavaScript.

It uses:

HTML canvas for rendering the road, cars, and sensors

Simple physics for car movement

Ray‑based sensors for environment perception

A tiny neural network (no ML libraries) that you can “train” by evolving the best cars over time

A visualizer to see the neural network’s activations

How it works
When you load the page, it automatically spawns AI‑controlled cars.

Each AI car has:

Sensors that cast rays and detect borders/traffic

A small NeuralNetwork that takes sensor readings and outputs actions (forward, left, right, reverse)

Simple physics and collision detection against the road and traffic

You do not control the main car with the keyboard; it drives itself based on its neural network.

Getting started
Clone or download the project.

Start a local server (for example):

VS Code Live Server, or

npx http-server in the project folder

Open index.html in a modern browser.

You should see:

The road and AI cars on the left canvas

The neural network visualization on the right canvas

The main car will start driving automatically using its current “brain”.

Training the AI (simple explanation)
The training here is evolutionary, not backpropagation. You improve the AI by:

Spawning multiple AI cars

In main.js you’ll have something like:

js
const N = 100;          // number of AI cars
const cars = generateCars(N);
Letting them drive

Run the simulation and watch. Some cars crash quickly; some go further down the road.

Choosing the best car

Typically, the car that has progressed furthest:

js
let bestCar = cars.find(
  c => c.y === Math.min(...cars.map(c => c.y))
);
Saving the best brain

Hooked up to the Save and Discard buttons in index.html:

xml
<button onclick="save()">save</button>
<button onclick="discard()">discard</button>
In main.js (or a similar entry file):

js
function save() {
  localStorage.setItem(
    "bestBrain",
    JSON.stringify(bestCar.brain)
  );
}

function discard() {
  localStorage.removeItem("bestBrain");
}

window.save = save;
window.discard = discard;
Loading and mutating next run

On startup, if a saved brain exists, it’s loaded and slightly mutated to create variation:

js
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(
      localStorage.getItem("bestBrain")
    );
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}
Repeat

Over multiple runs, the AI typically gets better at staying on the road and avoiding traffic.

Files overview
index.html – page layout, canvases, buttons

style.css – canvas and layout styling

main.js – simulation setup, animation loop, car spawning, save/discard hooks

car.js – Car class (movement, polygon shape, collision, drawing, brain wiring)

road.js – Road class (lane positions, borders, drawing)

controls.js – control types (used to define AI / dummy behavior)

sensor.js – Sensor class (rays, intersections with borders/traffic)

network.js – NeuralNetwork and Level classes

visualizer.js – draws the neural network structure and activations

utils.js (if present) – helper functions (e.g., lerp, getIntersection, polysIntersect)