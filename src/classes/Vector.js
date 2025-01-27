export default class Vector{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    add(vector){
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    sub(vector){
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    mult(n){
        this.x *= n;
        this.y *= n;

        return this;
    }

    div(n){
        this.x /= n;
        this.y /= n;

        return this;
    }

    mag(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setMag(n){
        this.normalize();
        this.mult(n);
        return this;
    }

    dist(vector){
        const dx = this.x - vector.x;
        const dy = this.y - vector.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    normalize(){
        const mag = this.mag();
        if(mag !== 0){
            this.div(mag);
        }
        return this
    }

    limit(max){
        if(this.mag() > max){
            this.normalize();
            this.mult(max);
        }
        return this;
    }

    // ========================================================================
    // STATIC METHODS
    // ========================================================================
    static sub (v1, v2){
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static mag(vector){
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    static random2D(){
        const angle = Math.random() * Math.PI * 2;
        return new Vector(Math.cos(angle), Math.sin(angle));
    }
}