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
            
            Crafty.c('Reticle', {
                _player: null,
                Reticle: function (player) {
                    this._player = player,
                    this.attr('h', 1);
                    
                    this.bind('EnterFrame', function () {
                        var x = this._player.attr('x') + this._player.attr('w') / 2,
                            y = this._player.attr('y') + this._player.attr('h') / 2,
                            power = this._player.attr('shotPower'),
                            angle = this._player.attr('shotAngle');
                        this.attr({
                            w: power / srawg.constants.maxPower * 50,
                            rotation: angle / (Math.PI * 2) * 360,
                            x: x + 5 * Math.cos(angle),
                            y: y + 5 * Math.sin(angle)
                        });
                    });
                }
            });
            
            Crafty.c('Player', {
                _hasTurn: false,
                _shooting: false,
                shotAngle: 0,
                shotPower: 100,
                _id: 0,
                _controls: {
                    left: false, 
                    right: false, 
                    up: false, 
                    down: false
                },
                _reticle: null,
                
                Player: function (id) {
                    this._id = id;
                    var controls = this._controls;
                    
                    this.bind('EnterFrame', function () {
                        var powerIncrement = 10,
                            angleIncrement = Math.PI * 2 / 300;
                        if (this._hasTurn) {
                            if (!this._shooting) {
                                if (controls.up) {
                                    this.shotPower += powerIncrement;
                                    if (this.shotPower > 1000) {
                                        this.shotPower = 1000;
                                    }
                                } 
                                if (controls.down) {
                                    this.shotPower -= powerIncrement;
                                    if (this.shotPower < 0) {
                                        this.shotPower = 0;
                                    }
                                }
                                if (controls.right) {
                                    this.shotAngle += angleIncrement;
                                    if (this.shotAngle > Math.PI * 2) {
                                        this.shotAngle -= Math.PI * 2;
                                    }
                                }
                                if (controls.left) {
                                    this.shotAngle -= angleIncrement;
                                    if (this.shotAngle < 0) {
                                        this.shotAngle += Math.PI * 2;
                                    }
                                }
                            }
                            
                        } 
                    }).bind('KeyDown', function (e) {
                        if (this._hasTurn) {
                            if (e.keyCode === Crafty.keys.RIGHT_ARROW) 
                                controls.right = true;
                            if (e.keyCode === Crafty.keys.LEFT_ARROW) 
                                controls.left = true;
                            if (e.keyCode === Crafty.keys.UP_ARROW) 
                                controls.up = true;
                            if (e.keyCode === Crafty.keys.DOWN_ARROW) 
                                controls.down = true;
                        }
                    }).bind('KeyUp', function (e) {
                        if (this._hasTurn) {
                            if (e.keyCode === Crafty.keys.RIGHT_ARROW) 
                                controls.right = false;
                            if (e.keyCode === Crafty.keys.LEFT_ARROW) 
                                controls.left = false;
                            if (e.keyCode === Crafty.keys.UP_ARROW) 
                                controls.up = false;
                            if (e.keyCode === Crafty.keys.DOWN_ARROW) 
                                controls.down = false;
                        }
                    });
                },
                startTurn: function () {
                    this._hasTurn = true;
                    this._shooting = false;
                    this._reticle = Crafty.e();
                    this._reticle.addComponent('2D, Canvas, Rotation, Reticle, Color')
                        .color('#fff')
                        .Reticle(this);
                },
                endTurn: function () {
                    this._hasTurn = false;
                    this._controls = {
                        left: false,
                        right: false,
                        up: false,
                        down: false
                    };
                    this._reticle = null;
                },
                fire: function (cb) {
                    this._shooting = true;
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