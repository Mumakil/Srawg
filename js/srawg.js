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
        playerSize: 2
    };
    
    window.srawg.game = (function () {
        var init;
        
        init = function () {
            Crafty.init(srawg.constants.width, srawg.constants.height);
            Crafty.background('#000');
            
            $(window).blur(function () {
                Crafty.pause();
            })
            $('body').focus(function () {
                Crafty.pause();
            });
            
            srawg.scenes.init();
            
            Crafty.scene('loading');
        };
        
        return {
            init: init
        };
    }());
    
    $(document).ready(function () {
        window.srawg.game.init();
    });
}());