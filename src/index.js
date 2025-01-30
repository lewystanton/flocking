import './classes/helpers';
import Screen from './classes/Screen';
import Boid from './classes/Boid';
import Vector from './classes/Vector';
import Boundary from './classes/Boundary';
import Quadtree from './classes/Quadtree';

import './main.scss';

class Index {
    constructor() {
        this.screen = new Screen(window.innerWidth, window.innerHeight);
        this.boundary = new Boundary(0, 0, window.innerWidth, window.innerHeight, this);
        this.quadtree = new Quadtree(this.boundary, 10, this);

        this.flock = [];
        this.maxFlockSize = 50;
        this.isMouseDown = false;
        this.mousePos = new Vector();

        this.targetFPS = 60;
        this.frameTimes = [];
        this.currentFps = 0;
        this.lastTime = performance.now();
        this.lastTimestamp = performance.now();
        this.delta = 0;
        this.frameCount = 0;
        this.averageFps = this.targetFPS;
        this.currentFps = 0;

        this.selfOptimise = true;

        for (let i = 0; i < this.maxFlockSize; i++) {
            this.boid = new Boid(window.random(0, window.innerWidth), window.random(0, window.innerHeight), this);
            this.flock.push(this.boid);
        }
    }

    start() {
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

    loop() {
        requestAnimationFrame(() => this.loop());

        const now = performance.now();
        const frameTime = now - this.lastTimestamp;
        this.delta = frameTime / 1000;

        const targetInterval = 1000 / this.targetFPS;

        if (frameTime >= targetInterval) {
            this.deltaScale = this.delta * this.targetFPS;
            this.lastTimestamp = now - (frameTime % targetInterval);

            this.frameCount++;

            if (now - this.lastTime >= 1000) {
                this.currentFps = this.frameCount;
                this.frameCount = 0;
                this.lastTime = now;
            }

            if (this.frameTimes.length > this.targetFPS * 2) {
                this.frameTimes.shift();
            }

            this.update(this.delta);
            this.draw();

            this.frameTimes.push(this.currentFps);
            this.averageFps = this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length;

            document.getElementById('fps').innerText = `Current FPS: ${Math.round(this.currentFps)} | Average FPS: ${Math.round(this.averageFps)}`;
            document.getElementById('flock').innerText = `Flock Size: ${this.flock.length}`;
        }
    }

    update(delta) {
        if(this.selfOptimise){
            if (this.currentFps < this.targetFPS - 10) {
                const firstBoid = this.flock[0];
                this.flock.splice(this.flock.indexOf(firstBoid), 1);
            } else {
                this.flock.push(new Boid(window.random(0, window.innerWidth), window.random(0, window.innerHeight), this));
            }
        }

        if (this.isMouseDown) {
            this.boid = new Boid(this.mousePos.x, this.mousePos.y, this);
            this.flock.push(this.boid);
        }

        this.flock.forEach(boid => {
            boid.update(delta);
        });

        this.quadtree.clear();
        this.flock.forEach(boid => {
            this.quadtree.insert(boid);
        });
    }

    draw() {
        this.screen.clear();

        this.flock.forEach(boid => {
            boid.drawHeatmap();
        });

        this.flock.forEach(boid => {
            boid.draw();
        });
    }
}

const flocking = new Index();
flocking.start();