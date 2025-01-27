export default class Boid {
    constructor(x, y) {
        this.position = new Classes.Vector(x, y);
        this.velocity = Classes.Vector.random2D();
        this.acceleration = new Classes.Vector();
        this.maxSpeed = 4;

        this.maxAlignmentForce = 1;
        this.maxCohesionForce = 1;
        this.maxSeparationForce = 1.05;

        this.radius = 2;
        this.perception = 100;

        this.velocity.mult(this.maxSpeed);

        this.flock = [];
        this.neighbours = [];

        this.heatmap = true;
        this.heatmapStroke = '#ED4C67';
        this.heatmapRGB = [
            parseInt(this.heatmapStroke.substr(-6,2),16),
            parseInt(this.heatmapStroke.substr(-4,2),16),
            parseInt(this.heatmapStroke.substr(-2),16)
        ];
        this.heatmapBackground = `rgba(${this.heatmapRGB[0]}, ${this.heatmapRGB[1]}, ${this.heatmapRGB[2]}, 0.05)`;
    }

    doFlocking(flock) {
        this.flock = flock;
        this.neighbours = [];

        for (let boid of this.flock) {
            if (boid === this) continue;

            const d = this.checkDistance(this.position, boid.position);

            if (d < (this.perception * this.perception)) {
                this.neighbours.push(boid);
            }
        }

        let a = this.alignment();
        let c = this.cohesion();
        let s = this.separation();

        this.acceleration.add(a);
        this.acceleration.add(c);
        this.acceleration.add(s);
    }

    alignment() {
        let steering = new Classes.Vector();
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
        let steering = new Classes.Vector();
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
        let steering = new Classes.Vector();
        let total = 0;

        for (let boid of this.neighbours) {
            let diff = Classes.Vector.sub(this.position, boid.position);
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

    wrapEdges(screen){
        if (this.position.x < 0) this.position.x = screen.width;
        if (this.position.x > screen.width) this.position.x = 0;

        if (this.position.y < 0) this.position.y = screen.height;
        if (this.position.y > screen.height) this.position.y = 0;
    }

    update(screen) {
        this.position.add(this.velocity)
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
        this.wrapEdges(screen);
    }

    drawHeatmap(screen) {
        if(this.heatmap){
            screen.circle(this.position.x, this.position.y, this.perception / 2, this.heatmapBackground);
            //screen.strokeCircle(this.position.x, this.position.y, this.perception / 2, this.heatmapStroke, 1);

            for (let boid of this.neighbours) {
                const d = this.checkDistance(this.position, boid.position);

                if (d < (this.perception * this.perception)) {
                    screen.line(this.position.x, this.position.y, boid.position.x, boid.position.y, this.heatmapStroke, 1);
                }
            }
        }
    }

    draw(screen) {
        screen.circle(this.position.x, this.position.y, this.radius, '#ffffff');
    }
}