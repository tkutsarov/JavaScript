var spaceships = spaceships || {};

spaceships.engine = {
    "draw": 
        function () {
            // clear the canvas
            spaceships.field.context.clearRect(0,0, spaceships.field.canvas.width, spaceships.field.canvas.height);

            // shorten the context referral
            var ctx = spaceships.field.context;

            // draw the player
            //ctx.fillStyle = "yellow";
            ctx.drawImage(spaceships.field.shipImage, spaceships.player.x, spaceships.player.y, spaceships.player.width, spaceships.player.height);

            // draw the enemies

            spaceships.components.enemies.forEach(function (enemy) {
                ctx.drawImage(spaceships.field.spriteEnemy, 5, 5, 50, 50, enemy.x, enemy.y, enemy.width, enemy.height);          
            });

            // draw player bullets
            spaceships.components.playerWeapons.forEach(function (weapon) {
                ctx.fillRect(weapon.x, weapon.y, weapon.width, weapon.height);
            });

            // call the update
            spaceships.engine.update();                   
        },

    "update": 
        function () {
            // shorten the canvas referral
            var cnv = spaceships.field.canvas;

            // track when to spawn new enemies
            spaceships.field.spawnDelay -= 1;

            // if it is time to respawn execute the code
            if(spaceships.field.spawnDelay === 0) {
                spaceships.components.spawnEntities();
            }

            // pressed key events for moving the player
            if(spaceships.components.pressedKey[87] === 1) {
                if(spaceships.player.y > 0) {
                    spaceships.player.y = spaceships.player.y - spaceships.player.speedY;
                }                   
            }              
            if(spaceships.components.pressedKey[65] === 1) {
                if(spaceships.player.x > 0) {
                    spaceships.player.x = spaceships.player.x - spaceships.player.speedX;
                }
            } 
            if(spaceships.components.pressedKey[83] === 1) {
                if(spaceships.player.y < cnv.height - spaceships.player.height) {
                    spaceships.player.y = spaceships.player.y + spaceships.player.speedY;
                }
            } 
            if(spaceships.components.pressedKey[68] === 1) {  
                if(spaceships.player.x < cnv.width - spaceships.player.width) {
                    spaceships.player.x = spaceships.player.x + spaceships.player.speedX;
                }
            }

            // fire the player weapon
            if(spaceships.components.pressedKey[spaceships.player.actionKey] === 0 ) {
                spaceships.player.keyUpState = true;
            }

            // track the current weapon's ammo 
            if(spaceships.components.pressedKey[spaceships.player.actionKey] === 1 && spaceships.player.keyUpState === true) {  
                var bullet = JSON.parse(JSON.stringify(spaceships.player.weapon));
                // generate the "bullet" in the middle of the player top
                bullet.x = spaceships.player.x + spaceships.player.width/2 - 2;
                bullet.y = spaceships.player.y;

                // if the weapon is not basic type do this code
                if(spaceships.player.ammo !== "unlimited") {
                    spaceships.player.ammo -= 1;

                    // if the ammo is out, switch to basic weapon
                    if(spaceships.player.ammo <= 0) {
                        spaceships.player.weaponType = "projectile";
                        spaceships.player.weapon = new spaceships.components._weapon(3, 4, 0, 6, 20);
                        spaceships.player.ammo = "unlimited";
                    }
                }

                // add each fired bullet to the array of the player
                spaceships.components.playerWeapons.push(bullet);

                // control the fire button /avoid constant firing on button hold/
                spaceships.player.keyUpState = false;
            }

            // update enemies and possible collision with the player
            spaceships.components.enemies.forEach(function (enemy) {
                enemy.y = enemy.y + enemy.speedY;

                if(enemy.health > 0) {
                    if(spaceships.engine.collision(enemy, spaceships.player)) {
                        spaceships.player.health -= enemy.health;
                        // prepare the collided enemy for deletion
                        enemy.health = 0;

                        // game over event
                        if(spaceships.player.health <= 0) {                               
                            clearTimeout(spaceships.loop.timeout);                                   
                            spaceships.field.context.clearRect(0,0, spaceships.field.canvas.width, spaceships.field.canvas.height);
                            spaceships.field.context.fillStyle = "red";
                            spaceships.field.context.font = "80px Arial";
                            spaceships.field.context.textAlign = "center";
                            spaceships.player.health = 0;
                            spaceships.field.context.fillText("GAME OVER", cnv.width/2, cnv.height/2);
                            spaceships.field.gameover = true;
                        }
                    }
                }                   
            });

            // make temp arrays to remove the destroyed/gone bullets/enemies
            var tempPlayerWeapons = spaceships.components.playerWeapons;
            spaceships.components.playerWeapons = [];
            var tempEnemies = spaceships.components.enemies;
            spaceships.components.enemies = [];

            // update player "bullets" state and collision with enemies
            tempPlayerWeapons.forEach(function (bullet) {    
                bullet.y = bullet.y - bullet.speedY;

                tempEnemies.forEach(function (enemy) {                        
                    if(spaceships.engine.collision(bullet, enemy)) {
                        enemy.health -= bullet.damage; 
                        spaceships.player.scores += bullet.damage;
                        bullet.damage = 0;
                    }                     
                });

                // put back in the array only the "live" bullets
                if(bullet.y > 0 - bullet.height && bullet.damage !== 0) {
                    spaceships.components.playerWeapons.push(bullet);
                }                 
            });          

            // remove destroyed/lost enemies
            tempEnemies.forEach(function (enemy) {
                if(enemy.health > 0 && enemy.y <= cnv.height) {
                    spaceships.components.enemies.push(enemy);
                } 
                if (enemy.health === 0) {
                    spaceships.player.scores += 50;
                }
            });

            //update menu board
            spaceships.field.scores.innerHTML = (spaceships.player.scores);
            spaceships.field.health.innerHTML = (spaceships.player.health);
            spaceships.field.weapon.innerHTML = (spaceships.player.weaponType);
            spaceships.field.ammo.innerHTML = (spaceships.player.ammo);
        },

    "collision":
        function (bullet, unit) {
            if(bullet.x + bullet.width >= unit.x && bullet.x <= unit.x + unit.width && 
               bullet.y + bullet.height >= unit.y && bullet.y <= unit.y + unit.height) {
                return true;
            } else {
                return false;
            }               
        },              
}; 

