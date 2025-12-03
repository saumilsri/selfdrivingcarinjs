export class Sensor{
    constructor(car){
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
}


    update(roadBoarders,traffic){
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
        this.readings.push(
            this.#getReading(
                this.rays[i], roadBoarders, traffic
            )
        );
    }
}

    #getReading(ray,roadBoarders,traffic){
        let touches=[];

        for(let i=0; i<roadBoarders.length;i++){
            const touch = getIntersection(
                ray[0], ray[1], roadBoarders[i][0], roadBoarders[i][1]
            );
            if(touch){
            touches.push(touch);
            }
        }

        for(let i =0; i<traffic.length; i++){
            const poly=traffic[i].polygon;
            for (let j = 0; j<poly.length;j++){
                const value = getIntersection(
                    ray[0], ray[1], poly[j], poly[(j+1)%poly.length]
                );
                if(value){
                touches.push(value);
                }
            }
        }

        if(touches.length==0){
            return null;
        } else{
            const offsets=touches.map(e=>e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
    }

    #castRays(){
        this.rays = [];

        for(let i = 0; i < this.rayCount; i++){
            const t = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1);
            const rayAngle =
                lerp(this.raySpread / 2, -this.raySpread / 2, t) + this.car.angle;

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            };

            this.rays.push([start, end]);
        }
    }

    draw(ctxt){
        for (let i = 0; i < this.rays.length; i++) {
            let end = this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];
            }
            const ray = this.rays[i];
            ctxt.beginPath();
            ctxt.lineWidth = 2;
            ctxt.strokeStyle = "yellow";
            ctxt.moveTo(ray[0].x, ray[0].y);
            ctxt.lineTo(end.x, end.y);
            ctxt.stroke();
            ctxt.beginPath();
            ctxt.lineWidth = 2;
            ctxt.strokeStyle = "black";
            ctxt.moveTo(ray[1].x, ray[1].y);
            ctxt.lineTo(end.x, end.y);
            ctxt.stroke();
        }
    }
}
