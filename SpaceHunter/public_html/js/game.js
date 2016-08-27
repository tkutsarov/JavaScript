// game namespace
var spaceships = spaceships || {};

spaceships.loop = function(callback) {
    spaceships.loop.timeout = setTimeout(callback, 1000/50);
}         

spaceships.game = {
    "init": function() {     
        if(spaceships.field.gameover === true){
            return true;
        }
        // enter the game
        spaceships.engine.draw(); 
        // start the game loop
        spaceships.loop(spaceships.game.init);                      
    },

    "initialGameLoad": function initialGameLoad() {
        spaceships.field.shipImage.src = 'img/ship.gif',              
        spaceships.field.spriteAsteroid.src = 'img/asteroid3.png',
        spaceships.field.spriteEnemy.src = 'img/RoboChopper.png'

        // event listeners
        window.addEventListener("keydown", function(e) {
            spaceships.components.pressedKey[e.keyCode] = 1;
        });

        window.addEventListener("keyup", function(e) {
            spaceships.components.pressedKey[e.keyCode]=0;
        });

        // create the pressed key array to follow key up and key down events
        for(var i = 0; i <= 256; i++) {
            spaceships.components.pressedKey.push(0);
        }
        console.debug("in load")
    },

    "startGame": function() {
        this.initialGameLoad();
        this.init(); 
    }
}


