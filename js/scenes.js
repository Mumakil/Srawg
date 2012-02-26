(function () {

  if (typeof window.srawg === 'undefined') {
    window.srawg = {};
  }

  window.srawg.scenes = (function () {
    var init;

    init = function () {
      console.group('Init scenes');
      
      console.debug("Creating scene 'Game'");
      Crafty.scene('game', function () {
        console.group('Scene: Game');
        console.info('Starting');
        var controller,
        endScene,
        sun,
        planets,
        players;

        controller = function (event, data) {
          if (event === 'fire') {

          } else if (event === 'startTurn') {

          } else if (event === 'endTurn') {

          }
        };

        endScene = function () {
          console.info('Scene done');
          console.groupEnd('Scene: Game');
          Crafty.scene('main');
        };

        sun = srawg.objects.createSun();
        planets = srawg.objects.createPlanets(5, sun);
        players = srawg.objects.createPlayers(2);

        srawg.objects.placePlayers(players, planets); 
        
        Crafty.e('Button').Button({
          text: 'End Game',
          textColor: '#000000',
          color: 'rgba(100, 100, 100, 0.8)',
          hoverColor: 'rgba(150, 150, 150, 1.0)',
          position: {
            x: 0, 
            y: 0
          }
        }).bind('ButtonClick', function () {
          endScene();
        });
      });

      console.debug("Creating scene 'Loading'");
      Crafty.scene('loading', function () {
        console.group('Scene: Loading');
        console.info('Starting');
        console.time('Loading')
        var loading,
            timer,
            points = '';
         Crafty.e("2D, Canvas, Text")
          .attr({x: srawg.constants.width / 2 - 100, y: srawg.constants.height / 2 - 35})
          .text("Loading")
          .textColor('#ffffff')
          .textFont({size: '30px', weight: 'bold', family: 'Verdana'});
        timer = setInterval(function () {
          if (points.length === 3) {
            points = '';
          } else {
            points = points += '.';
          }
          loading.text("Loading" + points);
        }, 300);
        srawg.components.init(function () {
          timer = clearInterval(timer)
          console.timeEnd('Loading');
          console.info('Scene done');
          console.groupEnd('Scene: Loading');
          Crafty.scene('main');
        });
      });
      
      console.debug("Creating scene 'Main'");
      Crafty.scene('main', function () {
        console.group('Scene: Main');
        console.info('Starting');
        var title,
            startGame;
        
        title = Crafty.e('2D, Canvas, Text')
          .attr({x: srawg.constants.width / 2 - 100, y: 100})
          .text('SRAWG!')
          .textFont({size: '40px', weight: 'bold', family: 'Verdana'})
          .textColor('#ffffff');
          
        startGame = Crafty.e('Button').Button({
          text: 'Start Game',
          textColor: '#000000',
          color: 'rgba(100, 100, 100, 0.8)',
          hoverColor: 'rgba(150, 150, 150, 1.0)',
          position: {
            x: srawg.constants.width / 2 - 100, 
            y: 150
          }
        }).bind('ButtonClick', function () {
          console.info('Scene done');
          console.groupEnd('Scene: Main');
          Crafty.scene('game');
        });
      });
      console.groupEnd('Init scenes');
    };

    return {
      init: init
    };
  }());
}());