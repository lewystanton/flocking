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
        this.maxFlockSize = 500;
        this.isMouseDown = false;
        this.mousePos = new Vector();

        this.looping = true;
        this.targetFPS = 60;
        this.frameTimes = [];
        this.currentFps = 0;
        this.frameInterval = 1000 / this.targetFPS;
        this.lastTimestamp = performance.now();
        this.delta = 0;
        this.deltaScale = 0;
        this.averageFps = this.targetFPS;

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
        if (this.looping) {
            requestAnimationFrame(() => this.loop());
        }

        const now = performance.now();
        const frameTime = now - this.lastTimestamp;

        this.delta = frameTime / 1000;

        if (frameTime >= this.frameInterval) {
            this.deltaScale = this.delta * this.targetFPS;
            this.lastTimestamp = now - (frameTime % this.frameInterval);

            this.update(this.delta);
            this.draw();

            this.currentFps = 1000 / frameTime;

            document.getElementById('fps').innerText = `FPS: ${Math.round(this.currentFps)}`;
            document.getElementById('flock').innerText = `Flock Size: ${this.flock.length}`;
        }
    }

    update() {
        if (this.currentFps < this.targetFPS - 10) {
            const lastBoid = this.flock[this.flock.length - 1];
            this.flock.splice(this.flock.indexOf(lastBoid), 1);
        } else {
            this.flock.push(new Boid(window.random(0, window.innerWidth), window.random(0, window.innerHeight), this));
        }

        if (this.isMouseDown) {
            this.boid = new Boid(this.mousePos.x, this.mousePos.y, this);
            this.flock.push(this.boid);

            if (this.flock.length > this.maxFlockSize) {
                this.flock.shift();
            }
        }

        this.flock.forEach(boid => {
            boid.doFlocking(this.flock);
            boid.update(this.screen);
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