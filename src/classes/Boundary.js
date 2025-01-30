export default class Boundary{
    constructor(x, y, w, h, _game){
        this._game = _game;
        this.position = {x, y};
        this.w = w;
        this.h = h;
    }

    contains(object){
        return (
            object.position.x >= this.position.x &&
            object.position.x < this.position.x + this.w &&
            object.position.y >= this.position.y &&
            object.position.y < this.position.y + this.h
        );
    }

    intersects(range){
        return !(
            range.position.x > this.position.x + this.w ||
            range.position.x + range.w < this.position.x ||
            range.position.y > this.position.y + this.h ||
            range.position.y + range.h < this.position.y
        );
    }

    draw(){
        this._game.screen.strokeColor = '#ED4C67';
        this._game.screen.strokeRectangle(this.position.x, this.position.y, this.w, this.h);
    }
}