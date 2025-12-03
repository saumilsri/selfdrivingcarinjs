# Self-Driving Car in JavaScript

**Credits:**  
This project is based on an online course by Radu Mariescu-Istodor. I followed and adapted his approach to learn and experiment with JavaScript and simple AI.

## Motivation
I built this project to learn more about:

- JavaScript  
- Basic physics for movement  
- Simple AI concepts  
- Neural networks without ML libraries  
- Sensors and real-time decision-making  

This project allowed me to see the AI “brain” make decisions and improve through evolutionary training.

---

## Overview
This is a self-driving car simulation written in pure JavaScript.

It uses:

- HTML Canvas for rendering road, cars, and sensors  
- Simple physics for realistic car movement  
- Ray-based sensors for reading the environment  
- A tiny neural network, built from scratch  
- A live visualizer to display activations of the neural network

---

## How It Works
When the page loads, the simulation automatically spawns AI-controlled cars.

Each AI car contains:

- Sensors that detect road borders and traffic  
- A small NeuralNetwork (no external libraries)  
- Physics engine for speed, steering, and collision  
- Behavior driven by the neural network: forward, reverse, left, and right  

You do not control the main AI car. It drives entirely on its own.

---

## Getting Started

### 1. Clone or download the project.

### 2. Start a local server  
Examples:

```bash
# VS Code Live Server extension
# or with Node:
npx http-server
```

### 3. Open `index.html` in a modern browser.

You should now see:

- Left canvas: road, cars, and sensors  
- Right canvas: neural network visualizer  

The main AI car will start driving automatically.

---

## Training the AI (Evolutionary Approach)

Training here is not done via backpropagation.  
Instead, the AI improves by evolving better versions over time.

### 1. Spawn multiple AI cars

```js
const N = 100;     // number of AI cars
const cars = generateCars(N);
```

### 2. Let them drive  
Some cars will crash early; others will progress further.

### 3. Select the best car

```js
let bestCar = cars.find(
  c => c.y === Math.min(...cars.map(c => c.y))
);
```

### 4. Save or discard the best “brain”  
Buttons in `index.html`:

```html
<button onclick="save()">save</button>
<button onclick="discard()">discard</button>
```

Functions in `main.js`:

```js
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
```

### 5. Load and mutate on next run

```js
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
```

This creates variation so the AI can evolve.

### 6. Repeat  
Over several generations, the AI improves at staying on the road and avoiding traffic.

---

## Files Overview

| File | Description |
|------|-------------|
| index.html | Layout, canvases, Save/Discard buttons |
| style.css | Page and canvas styling |
| main.js | Simulation setup, animation loop, save/load logic |
| car.js | Car physics, movement, collision, neural net integration |
| road.js | Defines road, lanes, visual drawing |
| controls.js | Control definitions for AI/dummy behavior |
| sensor.js | Ray sensors, collision detection |
| network.js | NeuralNetwork and Level classes |
| visualizer.js | Draws neural network activations |
| utils.js | Helper functions (lerp, getIntersection, etc.) |

---