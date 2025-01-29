import './classes/helpers';
import Screen from './classes/Screen';
import Boid from './classes/Boid';
import Vector from './classes/Vector';

import './main.scss';
class Index {
    constructor(){
        this.screen = new Screen(window.innerWidth,window.innerHeight);
        this.flock = [];
        this.maxFlockSize = 500;
        this.isMouseDown = false;
        this.mousePos = new Vector();

        for(let i = 0; i < this.maxFlockSize; i++){
            this.boid = new Boid(window.random(0, window.innerWidth), window.random(0, window.innerHeight), this);
            this.flock.push(this.boid);
        }
    }

    start(){
        document.addEventListener('mousedown', (event) => {
            this.isMouseDown = true;
        });

        document.addEventListener('mousemove', (event) => {
            this.mousePos.x = event.clientX;
            this.mousePos.y = event.clientY;
        });

        document.addEventListener('mouseup', (event) => {
            this.isMouseDown = false;
        });

        this.loop();
    }

    loop(){
        this.update();
        this.draw();

        // limit the frame rate
        setTimeout(() => {
            requestAnimationFrame(() => this.loop());
        }, 1000 / 60);
    }

    update(){
        if(this.isMouseDown){
            this.boid = new Boid(this.mousePos.x, this.mousePos.y, this);
            this.flock.push(this.boid);

            if(this.flock.length > this.maxFlockSize){
                this.flock.shift();
            }

            console.log(this.flock.length);
        }

        this.flock.forEach(boid => {
            boid.doFlocking(this.flock);
            boid.update(this.screen);
        });
    }

    draw(){
        this.screen.clear();

        this.flock.forEach(boid => {
            boid.drawHeatmap();
            boid.draw();
        });
    }
}

const flocking = new Index();
flocking.start();