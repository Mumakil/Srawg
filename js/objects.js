(function () {
    if (typeof window.srawg === 'undefined') {
        window.srawg = {};
    }
    
    window.srawg.objects = (function () {
        var createPlanets,
            createPlanet,
            createPlayers,
            createPlayer,
            createSun,
            placePlayers;
        
        createPlanets = function (count, star) {
            var arr = [],
                planet,
                i;
                
            for (i = 0; i < count; i += 1) {
                planet = createPlanet(i, count, star);
                arr.push(planet);
            }
            return arr;
        };
        
        createPlanet = function (i, count, star) {
            var size = Math.floor(Math.random() * 30 + 10),
                theta = Math.random() * Math.PI * 2,
                r = Math.floor(srawg.constants.height / 4 / (count + 1) * (Math.random() - 0.5) / 2 + (i + 1) * srawg.constants.height / 2 / (count + 1)),
                speed = (Math.random() * Math.PI * 0.0005 + 0.0005) * srawg.constants.height / 2 / r,
                planet = Crafty.e();
                
            planet.addComponent('2D, Canvas, planet, PlanetMovement, GravitySource')
                .attr({ 
                    w: size,
                    h: size
                })
                .PlanetMovement(
                    star,    
                    r,
                    theta,
                    speed
                )
                .GravitySource(10);
            return planet;
        };
        
        createPlayers = function (count) {
            var arr = [],
                player,
                i;
            
            for (i = 0; i < count; i += 1) {
                player = createPlayer(i);
                arr.push(player);
            }
            return arr;
        };
        
        createPlayer = function (i) {
            var player = Crafty.e();
            player.addComponent('2D, Canvas, Color, PlanetMovement, Player')
                .color(srawg.constants.playerColors[i])
                .attr({h: srawg.constants.playerSize, w: srawg.constants.playerSize})
                .Player(i + 1);
            if (i == 0) {
                player.startTurn();
            }
            return player;
        };
        
        placePlayers = function (players, planets) {
            var i, 
                player,
                planet,
                usedPlanets = {};
            for (i = 0; i < players.length; i += 1) {
                while (true) {
                    planet = planets[Math.floor(Math.random() * planets.length)];
                    if (!usedPlanets[planet[0]]) {
                        usedPlanets[planet[0]] = true;
                        break;
                    }
                }
                player = players[i];

                player.PlanetMovement(
                    planet, 
                    planet.attr('w') / 2 + 5, 
                    Math.random() * Math.PI * 2, 
                    (Math.random() * 0.005 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
                );
            }
        };
        
        createSun = function () {
            var sun = Crafty.e(),
                size = Math.floor(40 + Crafty.math.randomInt(0, 10));
            sun.addComponent('2D, Canvas, sun, GravitySource')
                .GravitySource(50)
                .attr({
                    h: size,
                    w: size,
                    x: srawg.constants.width / 2 - size / 2,
                    y: srawg.constants.height / 2 - size / 2
                });
            return sun;
        };
        
        return {
            createSun: createSun,
            createPlanets: createPlanets,
            createPlayers: createPlayers,
            placePlayers: placePlayers
        };
    }());
}());
