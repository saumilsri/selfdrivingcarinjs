import { Controls } from './controls.js';
import { NeuralNetwork } from './network.js';
import { Sensor } from './sensor.js';

export class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.controlType = controlType;

        this.speed=0;
        this.acceleration=0.15;
        this.maxSpeed=maxSpeed;
        this.friction=0.08;
        this.direction = 1; //+ is forward, - is reverse
        this.angle = 0;
        this.damaged = false;

        this.useBrain=controlType=="AI";

        if(this.controlType!="DUMMY"){
        this.sensors = new Sensor(this);
        this.brain=new NeuralNetwork(
            [this.sensors.rayCount, 6, 4]
        );
        }
        this.controls=new Controls(this.controlType);
    }

    update(roadBoarders,traffic){
        if(!this.damaged){
        this.#move();
        this.polygon = this.#createPolygon();
        this.damaged=this.#assessDamage(roadBoarders,traffic);
        }
        if(this.sensors){
            this.sensors.update(roadBoarders,traffic);
            const offsets = this.sensors.readings.map(
                s=>s==null?0:1-s.offset
            );
            const outputs=NeuralNetwork.feedForward(offsets,this.brain);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.left=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
    
    }
    
    #assessDamage(roadBoarders,traffic){
        for (let i =0; i<roadBoarders.length;i++){
            if(polysIntersect(this.polygon,roadBoarders[i])){
                return true;
            }
        }

        for (let i =0; i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
        x: this.x - Math.sin(this.angle - alpha) * rad,
        y: this.y - Math.cos(this.angle - alpha) * rad
    });
    points.push({
        x: this.x - Math.sin(this.angle + alpha) * rad,
        y: this.y - Math.cos(this.angle + alpha) * rad
    });
    points.push({
        x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
        y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
    });
    points.push({
        x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
        y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
    });

    return points;
}


    #move(){
        if(this.controls.forward){
            this.direction = 1;
        } else if(this.controls.reverse){
            this.direction = -1;
        }

        if(this.controls.forward || this.controls.reverse){
            if(this.speed < this.maxSpeed){
                this.speed += this.acceleration;
            }
        } else {
            if(this.speed > 0){
                this.speed -= this.friction;
            if(this.speed < 0) this.speed = 0;
            }
        }
        if (this.speed > 0){
            if (this.direction == 1){
                if(this.controls.left){
                    this.angle+=0.03;
                }
                if(this.controls.right){
                    this.angle-=0.03;
                }
            } else {
                if(this.controls.left){
                    this.angle-=0.03;
                }
                if(this.controls.right){
                    this.angle+=0.03;
                }
            }
        }
            
        if (this.direction == 1){
            this.x-= Math.sin(this.angle)*this.speed;
        } else {
            this.x+= Math.sin(this.angle)*this.speed;
        }
            
        this.y -= Math.cos(this.angle)*this.speed*this.direction;
            
        }

    draw(ctxt,drawSensor=false){
        if(this.damaged){
            ctxt.fillStyle="gray";
        }else if(this.controlType=="AI"){
            ctxt.fillStyle="black";
        }else{
            ctxt.fillStyle="red";
        }
    if (!this.polygon) return; // guard for first frame if needed

    ctxt.beginPath();
    ctxt.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
        ctxt.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctxt.fill();
    if(this.sensors && drawSensor){
        this.sensors.draw(ctxt);
    }
    
}

}
