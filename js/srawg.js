(function () {

  if (typeof window.srawg === 'undefined') {
    window.srawg = {};
  }

  window.srawg.constants = {
    playerColors: [
      '#F00',
      '#0F0',
      '#00F',
      '#FF0',
      '#F0F',
      '#0FF'
    ],
    width: 700,
    height: 700,
    playerSize: 2,
    maxPower: 1000
  };

  window.srawg.game = (function () {
    var init;
    init = function () {
      console.debug('Init Game');
      
      srawg.constants.width = document.body.offsetWidth - 5;
      srawg.constants.height = document.body.offsetHeight - 1;

      Crafty.init(srawg.constants.width, srawg.constants.height);
      Crafty.background('#000');

      window.onblur = function () {
        Crafty.pause();
        console.group('Paused');
        console.debug('Blur! Pause!');
      };
      window.onfocus = function () {
        console.debug('Focus! Unpause!');
        console.groupEnd('Paused');
        Crafty.pause();
      };

      srawg.scenes.init();

      Crafty.scene('loading');
    };

    return {
      init: init
    };
  }());

  document.onreadystatechange = function (event) {
    if (event.target.readyState === 'complete')
      window.srawg.game.init();
  };
}());