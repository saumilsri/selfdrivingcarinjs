import { Car } from './car.js';
import { Road } from './road.js';
import { Visualizer } from './visualizer.js';
import { NeuralNetwork } from './network.js';

const carCanvas=document.getElementById("carCanvas");

carCanvas.width=200;

const networkCanvas=document.getElementById("networkCanvas");

networkCanvas.width=300;

const carCtxt = carCanvas.getContext("2d");
const networkCtxt = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width/2,carCanvas.width*.90);

const N = 1;
const cars = generateCars(N);
let bestCar = cars[0];

if(localStorage.getItem("bestBrain")){
    for(let i = 0; i<cars.length;i++){
        cars[i].brain=JSON.parse(
        localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.05);
        }
    
    }
}

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-250,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-450,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-600,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-620,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-740,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-820,30,50,"DUMMY",2),
];

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
}

function discard(){
    localStorage.removeItem("bestBrain")
}

window.save= save;
window.discard = discard;

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"))
    }
    return cars;
}

function animate(time){
    for(let i=0; i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i =0; i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    bestCar = cars.find(
        c=>c.y== Math.min(
            ...cars.map(c=>c.y)
        )
    );


    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    carCtxt.save();
    carCtxt.translate(0,-bestCar.y+carCanvas.height*.75);

    road.draw(carCtxt);
    for(let i=0; i<traffic.length;i++){
        traffic[i].draw(carCtxt);
    }
    carCtxt.globalAlpha=0.2;
    for(let i =0; i<cars.length;i++){
    cars[i].draw(carCtxt);
    }
    carCtxt.globalAlpha=1;
    bestCar.draw(carCtxt,true);

    carCtxt.restore();
    networkCtxt.lineDashOffset = -time/75;
    Visualizer.drawNetwork(networkCtxt,bestCar.brain);
    requestAnimationFrame(animate);
}

animate();