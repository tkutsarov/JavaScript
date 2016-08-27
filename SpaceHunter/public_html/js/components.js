var spaceships = spaceships || {};

spaceships.components = {
    pressedKey: [],

    unit: function (x, y, width, height, speedX, speedY, health, weaponType, actionKey) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = speedX;
        this.speedY = speedY;
        this.health = health;
        this.weaponType = weaponType;
        this.actionKey = actionKey;
        this.ammo = "unlimited";

        this.scores = 0;
        this.keyUpState = true;

        actionKeyReleased = true;
        switch(this.weaponType) {
            case "no":
                break;
            case "projectile":                                             
                this.weapon = new spaceships.components._weapon(3, 4, 0, 6, 20);
                break;          
            case "rockets":
                this.ammo = 100;
                this.weapon = new spaceships.components._weapon(4, 6, 0, 5, 40);
                break;
            case "self-guided":
                this.ammo = 50;
                this.weapon = new spaceships.components._weapon(4, 6, 4, 4, 30);
                break;
            case "laser":
                this.ammo = 200;
                this.weapon = new spaceships.components._weapon(2, 12, 0, 6, 50);
                break;
            default:
                console.log("No such weapon");
        }
    },

    _weapon: function (width, height, speedX, speedY, damage) {
        this.width = width;
        this.height = height;
        this.speedX = speedX;
        this.speedY = speedY;
        this.damage = damage;
    },

    consumables: function (effect, value) {               
        this.effect = effect;
        this.value = value;
        this.width = 10;
        this.height = 10;
        this.speedY = 4;
    },

    enemies: [],

    playerWeapons: [],

    enemyWeapons: [],

    consumablesArr: [],

    spawnEntities:
        function() {
           // get new random spawn timing
           spaceships.field.spawnDelay = spaceships.field.randomGenerator(30, 80);

           // spawn new random number of enemies 
           var spawnEnemies = spaceships.field.randomGenerator(2, 5);
           for(var i = 0; i < spawnEnemies; i++) {
               var randX = spaceships.field.randomGenerator(0, 980);       
               var randHealth = spaceships.field.randomGenerator(20,120);
               var randSpeedY = spaceships.field.randomGenerator(1, 4);
               var randWidth = spaceships.field.randomGenerator(20, 40);
               var newEnemy = new spaceships.components.unit(randX, 0, randWidth, 30, 2, randSpeedY, randHealth, "no");
               spaceships.components.enemies.push(newEnemy);
           }
        }
};
