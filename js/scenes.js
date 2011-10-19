(function () {

    if (typeof window.srawg === 'undefined') {
        window.srawg = {};
    }

    window.srawg.scenes = (function () {
        var init;
        
        init = function () {
            Crafty.scene('main', function () {
                var sun = srawg.objects.createSun(),
                    planets = srawg.objects.createPlanets(5, sun),
                    players = srawg.objects.createPlayers(2);

                srawg.objects.placePlayers(players, planets); 
            });

            Crafty.scene('loading', function () {
                var loading = Crafty.e();
                loading.addComponent("2D, Canvas, Text, css").attr({w: 100, h: 20, x: 150, y: 120})
                    .text("Loading");

                srawg.components.init(function () {
                    Crafty.scene('main');
                });
            });
        };
        
        return {
            init: init
        };
    }());
}());