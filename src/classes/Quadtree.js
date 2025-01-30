import Boundary from './Boundary.js';

export default class Quadtree{
    constructor(boundary, capacity, _game){
        this._game = _game;
        this.boundary = boundary;
        this.capacity = capacity;
        this.objects = [];
        this.divided = false;

        this.divisions = {
            northwest: null,
            northeast: null,
            southwest: null,
            southeast: null
        }
    }

    insert(object){
        if(!this.boundary.contains(object)) {
            return false;
        }

        if(this.objects.length < this.capacity && !this.divided){
            this.objects.push(object);
            return true;
        }

        if(!this.divided){
            this.subdivide();
        }

        return this.divisions.northwest.insert(object) ||
               this.divisions.northeast.insert(object) ||
               this.divisions.southwest.insert(object) ||
               this.divisions.southeast.insert(object);
    }

    remove(object){
        if(!this.boundary.contains(object)){
            return false;
        }

        if(this.objects.includes(object)){
            this.objects.splice(this.objects.indexOf(object), 1);
            return true;
        }

        if(this.divided){
            return this.divisions.northwest.remove(object) ||
                   this.divisions.northeast.remove(object) ||
                   this.divisions.southwest.remove(object) ||
                   this.divisions.southeast.remove(object);
        }

        return false;
    }

    subdivide(){
        const x = this.boundary.position.x;
        const y = this.boundary.position.y;
        const w = this.boundary.w / 2;
        const h = this.boundary.h / 2;

        const nw = new Boundary(x, y, w, h, this._game);
        const ne = new Boundary(x + w, y, w, h, this._game);
        const sw = new Boundary(x, y + h, w, h, this._game);
        const se = new Boundary(x + w, y + h, w, h, this._game);

        this.divisions.northwest = new Quadtree(nw, this.capacity, this._game);
        this.divisions.northeast = new Quadtree(ne, this.capacity, this._game);
        this.divisions.southwest = new Quadtree(sw, this.capacity, this._game);
        this.divisions.southeast = new Quadtree(se, this.capacity, this._game);

        this.divided = true;

        for(const object of this.objects){
            this.divisions.northwest.insert(object) ||
            this.divisions.northeast.insert(object) ||
            this.divisions.southwest.insert(object) ||
            this.divisions.southeast.insert(object);
        }

        this.objects = [];
    }

    query(range, found = []){
        if(!this.boundary.intersects(range)){
            return found;
        }

        for(const object of this.objects){
            if(range.contains(object)){
                found.push(object);
            }
        }

        if(this.divided){
            this.divisions.northwest.query(range, found);
            this.divisions.northeast.query(range, found);
            this.divisions.southwest.query(range, found);
            this.divisions.southeast.query(range, found);
        }

        return found;
    }

    clear(){
        this.objects = [];

        if(this.divided){
            this.divisions.northwest.clear();
            this.divisions.northeast.clear();
            this.divisions.southwest.clear();
            this.divisions.southeast.clear();
        }

        this.divisions = {
            northwest: null,
            northeast: null,
            southwest: null,
            southeast: null
        }

        this.divided = false;
    }

    draw(){
        this.boundary.draw();

        if(this.divided){
            this.divisions.northwest.draw();
            this.divisions.northeast.draw();
            this.divisions.southwest.draw();
            this.divisions.southeast.draw();
        }
    }
}