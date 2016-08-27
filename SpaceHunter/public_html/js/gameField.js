var spaceships = spaceships || {};

spaceships.field = {
    "canvas": document.getElementById("canvas-id"),

    "scores": document.getElementById("scores"),

    "health": document.getElementById("health"),

    "weapon": document.getElementById("weapon"),

    "ammo": document.getElementById("ammo"),

    "spawnDelay": 20,

    "randomGenerator": function (start, end) {
        return Math.floor((Math.random()*(end - start + 1)) + start);
    },

    "shipImage": new Image(),

    "spriteAsteroid": new Image(),

    "spriteEnemy": new Image()               
};

spaceships.field.context = spaceships.field.canvas.getContext("2d");