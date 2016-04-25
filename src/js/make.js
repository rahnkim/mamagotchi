// helpers.js contains helper classes for game creation.

/* global mamagotchi, Phaser */

/** Main module. */
var mamagotchi = mamagotchi || {};

/** mamagotchi make submodule. */
mamagotchi.make = (function(m) {
  var make = {};

  /**
   * The character's stats with inner peace and fun properties.
   * @param {?number} innerPeace Character's "inner peace" stats.
   * @param {?number} fun Character's "fun" stats.
   * @param {?mamagotchi.make.StatusBar} innerPeaceStatusBar Associated inner
   *    peace status bar.
   * @param {?mamagotchi.make.StatusBar} funStatusBar Associated fun status bar.
   * @constructor
   */
  make.CharacterStatus = function(
      innerPeace, fun, innerPeaceStatusBar, funStatusBar) {
    this.innerPeace = innerPeace;
    this.fun = fun;
    this.innerPeaceStatusBar = innerPeaceStatusBar ? innerPeaceStatusBar : null;
    this.funStatusBar = funStatusBar ? funStatusBar : null;
  };

  /**
   * The depleting increment of the status.
   * @const
   * @type {number}
   */
  make.CharacterStatus.DEPLETION_INCREMENT = 0.001;

  /**
    * Stats properties allowed for operations.
    * @type {Array.<string>}
    */
  make.CharacterStatus.ALLOWED_OPERATION = ['innerPeace', 'fun'];

  /**
   * Changes this stats by adding the given stats values.
   * @param {!mamagotchi.make.CharacterStatus} otherStatus Stats to change this
   *    stats.
   */
  make.CharacterStatus.prototype.modifyWith = function(otherStatus) {
    var newStat;
    var self = this;
    make.CharacterStatus.ALLOWED_OPERATION.forEach(function(stat) {
      if (otherStatus.hasOwnProperty(stat) && self.hasOwnProperty(stat)) {
        newStat = self[stat] + otherStatus[stat];
        if (newStat > 100) {
          self[stat] = 100;
        } else if (newStat < 0) {
          self[stat] = 0;
        } else {
          self[stat] = newStat;
        }
      }
    });

    this.updateStatusBars();
  };

  /** Incrementally depletes the stats. */
  make.CharacterStatus.prototype.deplete = function() {
    var DEPLETION_INCREMENT = make.CharacterStatus.DEPLETION_INCREMENT;

    this.innerPeace -= this.innerPeace > 0 ? DEPLETION_INCREMENT : 0;
    this.fun -= this.fun > 0 ? DEPLETION_INCREMENT : 0;

    this.updateStatusBars();
  };

  /** Incrementally depletes the stats. */
  make.CharacterStatus.prototype.updateStatusBars = function() {
    if (this.innerPeaceStatusBar) {
      this.innerPeaceStatusBar.setPercent(this.innerPeace);
    }
    if (this.funStatusBar) {
      this.funStatusBar.setPercent(this.fun);
    }
  };

  /**
   * Status bar.
   * @constructor
   */
  make.StatusBar = function() {
    var game = m.game;

    /**
     * The bar game object group.
     * @type {Phaser.Group}
     */
    this.bar = game.add.group();

    var WIDTH = make.StatusBar.WIDTH;
    var HEIGHT = make.StatusBar.HEIGHT;

    var bgBitmap = game.add.bitmapData(WIDTH, HEIGHT);
    bgBitmap.ctx.fillStyle = make.StatusBar.BACKGROUND_COLOR;
    bgBitmap.ctx.beginPath();
    bgBitmap.ctx.rect(0, 0, WIDTH, HEIGHT);
    bgBitmap.ctx.fill();

    var background = game.add.sprite(0, 0, bgBitmap);
    background.anchor.set(0.5);
    this.bar.add(background);

    var barBitmap = game.add.bitmapData(WIDTH, HEIGHT);
    barBitmap.ctx.fillStyle = make.StatusBar.BAR_COLOR;
    barBitmap.ctx.beginPath();
    barBitmap.ctx.rect(0, 0, WIDTH, HEIGHT);
    barBitmap.ctx.fill();

    /**
     * The bar sprite.
     * @type {Phaser.Sprite}
     */
    this.barSprite = game.add.sprite(0 - background.width / 2, 0, barBitmap);
    this.barSprite.anchor.y = 0.5;
    this.bar.add(this.barSprite);
  };

  /**
   * Status bar width.
   * @const
   * @type {number}
   */
  make.StatusBar.WIDTH = 400;

  /**
   * Status bar height.
   * @const
   * @type {number}
   */
  make.StatusBar.HEIGHT = 50;

  /**
   * Background hex code.
   * @const
   * @type {string}
   */
  make.StatusBar.BACKGROUND_COLOR = 'blue';

  /**
   * Background hex code.
   * @const
   * @type {string}
   */
  make.StatusBar.BAR_COLOR = 'red';

  /**
   * Status change animation duration.
   * @const
   * @type {number}
   */
  make.StatusBar.ANIMATION_DURATION = 200;

  /**
   * Sets the status bar filled state.
   * @param {number} percentValue Number between 0 and 100.
   */
  make.StatusBar.prototype.setPercent = function(percentValue) {
    if (percentValue < 0) {
      percentValue = 0;
    }
    if (percentValue > 100) {
      percentValue = 100;
    }
    var newWidth = (percentValue * make.StatusBar.WIDTH) / 100;
    m.game.add.tween(this.barSprite).to(
      {width: newWidth}, make.StatusBar.ANIMATION_DURATION,
      Phaser.Easing.Linear.None, true);
  };

  /**
   * Sets the position of the status bar.
   * @param {number} x X-coord.
   * @param {number} y Y-coord.
   */
  make.StatusBar.prototype.setPosition = function(x, y) {
    this.bar.position.x = x;
    this.bar.position.y = y;
  };

  return make;
})(mamagotchi);
