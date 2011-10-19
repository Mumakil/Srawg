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
                
            planet.addComponent('2D, Canvas, planet, PlanetMovement')
                .attr({ 
                    w: size,
                    h: size
                })
                .PlanetMovement(
                    star,    
                    r,
                    theta,
                    speed
                );
            return planet;
        };
        
        createPlayers = function (count) {
            var arr = [],
                player,
                i;
            
            for (i = 0; i < count; i += 1) {
                player = createPlayer();
                arr.push(player);
            }
            return arr;
        };
        
        createPlayer = function () {
            var player = Crafty.e();
            player.addComponent('2D, Canvas, Color, PlanetMovement')
                .color(srawg.constants.playerColors[Math.floor(Math.random() * srawg.constants.playerColors.length)])
                .attr({h: srawg.constants.playerSize, w: srawg.constants.playerSize});
            return player;
        };
        
        placePlayers = function (players, planets) {
            var i, 
                player,
                planet;
            for (i = 0; i < players.length; i += 1) {
                player = players[i];
                planet = planets[Math.floor(Math.random() * planets.length)];
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
                size = Math.floor(40 + Math.random() * 10);
            sun.addComponent('2D, Canvas, sun')
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
