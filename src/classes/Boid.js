import Vector from "./Vector";
import Boundary from "./Boundary";
export default class Boid {
    constructor(x, y, _game) {
        this._game = _game;
        this.position = new Vector(x, y);
        this.velocity = Vector._random2D();
        this.acceleration = new Vector();
        this.maxSpeed = 4;

        this.maxAlignmentForce = 1;
        this.maxCohesionForce = 1;
        this.maxSeparationForce = 1;

        this.radius = 2;
        this.perception = 100;

        this.velocity.mult(this.maxSpeed);

        this.neighbours = [];
        this.highlight = false;

        this.heatmap = true;
        this.heatmapStroke = '#ED4C67';
        this.heatmapRGB = [
            parseInt(this.heatmapStroke.substr(-6,2),16),
            parseInt(this.heatmapStroke.substr(-4,2),16),
            parseInt(this.heatmapStroke.substr(-2),16)
        ];
        this.heatmapBackground = `rgba(${this.heatmapRGB[0]}, ${this.heatmapRGB[1]}, ${this.heatmapRGB[2]}, 0.05)`;
    }

    doFlocking(delta) {
        const boundary = new Boundary(this.position.x - (this.perception / 2), this.position.y - (this.perception / 2), this.perception, this.perception, this._game);
        const nearest = this._game.quadtree.query(boundary);

        this.neighbours = [];

        for (let boid of nearest) {
            if (boid === this) continue;

            this.neighbours.push(boid);
        }

        let a = this.alignment();
        let c = this.cohesion();
        let s = this.separation();

        this.acceleration.add(a);
        this.acceleration.add(c);
        this.acceleration.add(s);
    }

    alignment() {
        let steering = new Vector();
        let total = 0;

        for (let boid of this.neighbours) {
            steering.add(boid.velocity);
            total++;
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxAlignmentForce);
        }

        return steering;
    }

    cohesion() {
        let steering = new Vector();
        let total = 0;

        for (let boid of this.neighbours) {
            steering.add(boid.position);
            total++;
        }

        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxCohesionForce);
        }

        return steering;
    }

    separation() {
        let steering = new Vector();
        let total = 0;

        for (let boid of this.neighbours) {
            let diff = Vector._sub(this.position, boid.position);
            diff.div(this.position.dist(boid.position));
            steering.add(diff);
            total++;
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxSeparationForce);
        }

        return steering;
    }

    checkDistance(a, b){
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return dx * dx + dy * dy;
    }

    wrapEdges(){
        if(this.position.x > this._game.screen.width){
            this.position.x = 0;
        } else if(this.position.x < 0){
            this.position.x = this._game.screen.width;
        }

        if(this.position.y > this._game.screen.height){
            this.position.y = 0;
        } else if(this.position.y < 0){
            this.position.y = this._game.screen.height;
        }
    }

    update(delta) {
        this.doFlocking(delta);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);

        this.wrapEdges();
    }

    drawHeatmap() {
        if(this.heatmap){
            this._game.screen.circle(this.position.x, this.position.y, this.perception / 2, this.heatmapBackground);
            //this._game.screen.strokeCircle(this.position.x, this.position.y, this.perception / 2, this.heatmapStroke, 1);

            for (let boid of this.neighbours) {
                const d = this.checkDistance(this.position, boid.position);

                if (d < (this.perception * this.perception)) {
                    this._game.screen.line(this.position.x, this.position.y, boid.position.x, boid.position.y, this.heatmapStroke, 1);
                }
            }
        }
    }

    draw() {
        const color = this.highlight ? '#ff0000' : '#ffffff';
        this._game.screen.circle(this.position.x, this.position.y, this.radius, color);
    }
}