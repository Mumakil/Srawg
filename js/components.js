(function () {
    if (typeof window.srawg === 'undefined') {
        window.srawg = {};
    }
    
    window.srawg.components = (function () {
        var init,
            createSprites,
            createComponents;

        createSprites = function (cb) {
            var images = [
                'images/planet.png',
                'images/sun.jpg'
            ];
            Crafty.load(images, function () {
                Crafty.sprite(100, 'images/planet.png', { planet: [0, 0]});
                Crafty.sprite(100, 'images/sun.jpg', { sun: [0, 0]});
                cb.call();
            });
        };
        
        createComponents = function () {
            
            Crafty.c('PlanetMovement', {
                _orbitR: 0,
                _orbitTheta: 0,
                orbitParent: null,
                _angularSpeed: 0,
                _size: 20,
                PlanetMovement: function (parent, r, theta, angularSpeed) {
                    this._orbitR = r;
                    this._orbitTheta = theta;
                    this._angularSpeed = angularSpeed;
                    this.orbitParent = parent;
                    
                    if (this.orbitParent) {
                        this.attr({
                            x: this.orbitParent.attr('x') + this.orbitParent.attr('w') / 2 + this._orbitR * Math.cos(this._orbitTheta) - this.attr('w') / 2,
                            y: this.orbitParent.attr('y') + this.orbitParent.attr('h') / 2 + this._orbitR * Math.sin(this._orbitTheta) - this.attr('h') / 2
                        });
                    }
                    
                    this.bind('EnterFrame', function () {
                        if (this.orbitParent) {
                            this._orbitTheta += this._angularSpeed;
                            this.attr({
                                x: this.orbitParent.attr('x') + this.orbitParent.attr('w') / 2 + this._orbitR * Math.cos(this._orbitTheta) - this.attr('w') / 2,
                                y: this.orbitParent.attr('y') + this.orbitParent.attr('h') / 2 + this._orbitR * Math.sin(this._orbitTheta) - this.attr('h') / 2
                            });
                        }
                    });
                    return this;
                }
            });
            
            Crafty.c('Player', {
                _hasTurn: false,
                _angle: 0,
                _power: 0,
                _id: 0,
                
                Player: function (id) {
                    this._id = id;
                    
                    this.bind('EnterFrame', function () {
                        if (this._hasTurn) {
                            
                        } 
                    });
                },
                startTurn: function () {
                    this._hasTurn = true;
                },
                endTurn: function () {
                    this._hasTurn = false;
                },
                fire: function (cb) {
                    console.log('Player ' + this._id + ' firing, angle ' + Number.toFixed(this._angle, 2) + ', power ' + Number.toFixed(this._power, 2));
                    cb.call(this);
                }
            });
            
        };

        init = function (cb) {
            createComponents();
            createSprites(cb);
        };
        
        return {
            init: init
        };
    }());
}());