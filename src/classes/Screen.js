export default class Screen {
    #canvas;
    #context;
    #strokeColor;
    #color;
    #lineWidth;

    constructor(width, height, background = '#333333') {
        this.width = width;
        this.height = height;

        this.#canvas = document.createElement('canvas');
        this.#context = this.#canvas.getContext('2d');

        this.#canvas.width = width;
        this.#canvas.height = height;
        this.#canvas.style.width = `${width}px`;
        this.#canvas.style.height = `${height}px`;
        this.#canvas.style.background = background;

        this.color = '#ffffff';
        this.strokeColor = '#ffffff';
        this.#lineWidth = 1;

        this.#context.fillStyle = this.color;
        this.#context.strokeStyle = this.strokeColor;
        this.#context.lineWidth = this.lineWidth;

        document.body.appendChild(this.#canvas);
    }

    line(x1, y1, x2, y2, color, lineWidth = 1){
        this.#context.strokeStyle = color;
        this.#context.lineWidth = lineWidth;
        this.#context.beginPath();
        this.#context.moveTo(x1, y1);
        this.#context.lineTo(x2, y2);
        this.#context.stroke();
    }

    circle(x, y, radius, color) {
        if(color !== this.color){
            this.color = color;
            this.#context.fillStyle = color;
        }

        this.#context.beginPath();
        this.#context.arc(x, y, radius, 0, Math.PI * 2);
        this.#context.fill();
    }

    strokeCircle(x, y, radius, color = false, lineWidth = 1){
        if(lineWidth !== this.lineWidth){
            this.lineWidth = lineWidth;
            this.#context.lineWidth = lineWidth;
        }

        this.#context.beginPath();
        this.#context.arc(x, y, radius, 0, Math.PI * 2);
        this.#context.stroke();
    }

    rectangle(x, y, w, h){
        this.#context.beginPath();
        this.#context.rect(x, y, w, h);
        this.#context.fill();
    }

    strokeRectangle(x, y, w, h){
        this.#context.beginPath();
        this.#context.rect(x, y, w, h);
        this.#context.stroke();
    }

    text(text, x, y){
        this.#context.fillText(text, x, y);
    }

    set strokeColor(color){
        if(this.#strokeColor === color) return;

        this.#strokeColor = color;
        this.#context.strokeStyle = color;
    }

    set color(color){
        if(this.#color === color) return;

        this.#color = color;
        this.#context.fillStyle = color;
    }

    set lineWidth(width){
        if(this.lineWidth === width) return;

        this.#lineWidth = width;
    }

    clear(){
        this.#context.clearRect(0, 0, this.width, this.height);
    }
}