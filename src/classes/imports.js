import Screen from './Screen.js';
import Vector from './Vector.js';
import Boid from './Boid.js';

// for the quadtree project

export default {
    Screen,
    Vector,
    Boid
};

/* ================================ ================================ */
/* GLOBAL HELPERS                                                    */
/* ================================ ================================ */
window.random = (min, max) => Math.random() * (max - min) + min;