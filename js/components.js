(function () {
  if (typeof window.srawg === 'undefined') {
    window.srawg = {};
  }

  window.srawg.components = (function () {
    var init,
    createSprites,
    createComponents,
    loaded = false;

    createSprites = function (cb) {
      console.time('Load sprites');
      var images = [
        'images/planet.png',
        'images/sun.jpg'
      ];
      Crafty.load(images, function () {
        Crafty.sprite(100, 'images/planet.png', { planet: [0, 0]});
        Crafty.sprite(100, 'images/sun.jpg', { sun: [0, 0]});
        console.timeEnd('Load sprites');
        cb.call();
      });
    };

    createComponents = function () {
      console.group('Init components');
      
      console.debug("Creating component: 'Button'")
      Crafty.c('Button', {
        _buttonColor: null,
        _buttonHoverColor: null,
        Button: function (data) {
          var button,
              label;
          
          self = this;
          this._buttonColor = data.color;
          this._buttonHoverColor = data.hoverColor;
          button = Crafty.e('2D, Canvas, Color, Mouse')
            .attr({x: data.position.x, y: data.position.y, w: 250, h: 30})
            .bind('Click', function () {
              self.trigger('ButtonClick');
            })
            .bind('MouseOver', function () {
              button.color(self._buttonHoverColor);
            })
            .bind('MouseOut', function () {
              button.color(self._buttonColor);
            })
            .color(this._buttonColor);
          label = Crafty.e('2D, Canvas, Text')
            .attr({x: data.position.x + 10, y: data.position.y + 2, w: 230, h: 20})
            .textFont({size: '20px', weight: 'bold', family: 'Verdana'})
            .textColor(data.textColor)
            .text(data.text);
          return this;
        }
      });

      console.debug("Creating component: 'GravitySource'");
      Crafty.c('GravitySource', {
        mass: 0,
        radius: 0,

        GravitySource: function (mass) {
          this.mass = mass;
          return this;
        },
        getGravityFieldAt: function (x, y) {
          var dx = x - this.attr('x'),
              dy = y - this.attr('y'),
              r = Math.sqrt(dx*dx + dy*dy),
              angle = Math.atan(y / x),
              field = this.mass / Math.pow(r, 1);
          return {
            x: - Math.cos(angle) * field,
            y: - Math.sin(angle) * field
          };
        }
      });

      console.debug("Creating component: 'PlanetMovement'");
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

      console.debug("Creating component: 'Reticle'");
      Crafty.c('Reticle', {
        _player: null,
        Reticle: function (player) {
          this._player = player,
          this.attr('h', 1);

          this.bind('EnterFrame', function () {
            var x, y, power, angle;

            x = this._player.attr('x') + this._player.attr('w') / 2,
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
          return this;
        }
      });

      console.debug("Creating component: 'Projectile'");
      Crafty.c('Projectile', {
        _speedX: 0,
        _speedY: 0,
        mass: 0,
        Projectile: function (speed, angle, mass) {
          this._speedX = speed * Math.cos(angle);
          this._speedY = speed * Math.sin(angle);
          this.mass = mass

          if (!this.has('Collision')) this.addComponent('Collision');

          this.bind('EnterFrame', function () {
            var fieldX = 0, 
                fieldY = 0,
                newX,
                newY;
            self = this;
            _.each(Crafty('GravitySource'), function (sourceId, index) {
              var field = Crafty(sourceId).getGravityFieldAt(self.attr('x'), self.attr('y'));
              fieldX += field.x * 1000;
              fieldY += field.y * 1000;
            });
            console.log('GravityFieldSum:', fieldX, fieldY);
            this._speedX += fieldX * this.mass;
            this._speedY += fieldY * this.mass;
            console.log(this._speedX, this._speedY);
            newX = this.attr('x') + this._speedX / 50;
            newY = this.attr('y') + this._speedY / 50;
            
            if (
              newX > srawg.constants.width * 2 || newX < - srawg.constants.width ||
              newY > srawg.constants.height * 2 || newY < - srawg.constants.height
            ) {
              this.trigger('ShotEnd');
              this.destroy();
            }
            
            this.attr({
              x: newX, 
              y: newY
            });
          });
          return this;
        }
        
      });

      console.debug("Creating component: 'Player'");
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
        _controller: null,

        Player: function (id, controller) {
          var controls = this._controls;

          this._id = id;
          this._controller = controller;

          this.bind('EnterFrame', function () {
            var powerIncrement = 15,
            angleIncrement = Math.PI * 2 / 200;
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
              if (e.keyCode === Crafty.keys.SPACE)
              this.fire()
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
          return this;
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
          this._shooting = false;
          this._controls = {
            left: false,
            right: false,
            up: false,
            down: false
          };
        },
        fire: function () {
          var projectile;
          this._shooting = true;
          this._reticle.destroy()
          this._reticle = null;
          console.log(
            'Player ' + this._id + ' firing, angle ' +
            (new Number(this.shotAngle)).toFixed(2) + ', power ' +
            (new Number(this.shotPower)).toFixed(2)
          );
          projectile = Crafty.e('Projectile, 2D, Canvas, Color')
            .attr({w: 2, h: 2, x: this.attr('x'), y: this.attr('y')})
            .Projectile(this.shotPower, this.shotAngle, 1)
            .color('#FFFF00');
        }
      });
      console.groupEnd('Init components');
    };

    init = function (cb) {
      console.group('Init components and sprites');
      if (!loaded) {
        createComponents();
        createSprites(function () {
          console.groupEnd('Init components and sprites');
          cb();
        });
        loaded = true;
      } else {
        if (typeof cb === 'function') {
          cb();
        }
      }
    };

    return {
      init: init
    };
  }());
}());
