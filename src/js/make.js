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
   * @param {?number} excite Character's "excite" stats.
   * @param {?mamagotchi.make.StatusBar} innerPeaceStatusBar Associated inner
   *    peace status bar.
   * @param {?mamagotchi.make.StatusBar} exciteStatusBar Associated excite
   *    status bar.
   * @constructor
   */
  make.CharacterStatus = function(
      innerPeace, excite, innerPeaceStatusBar, exciteStatusBar) {
    this.innerPeace = innerPeace;
    this.excite = excite;
    this.innerPeaceStatusBar = innerPeaceStatusBar ? innerPeaceStatusBar : null;
    this.exciteStatusBar = exciteStatusBar ? exciteStatusBar : null;
  };

  /**
   * Character's emotional state.
   * @typedef {number} mamagotchi.EmotionalState
   */

  /**
   * Enum for character's emotional state based on their status attributes.
   * @enum {mamagotchi.EmotionalState}
   */
  make.CharacterStatus.EmotionalState = {
    HAPPY: 0,
    NEUTRAL: 1,
    UNHAPPY: 2
  };

  /**
   * The depleting increment of the inner peace status.
   * @const
   * @type {number}
   */
  make.CharacterStatus.INNER_PEACE_DEPLETION_INCREMENT = 0.5;

  /**
   * The depleting increment of the excite status.
   * @const
   * @type {number}
   */
  make.CharacterStatus.EXCITE_DEPLETION_INCREMENT = 0.8;

  /**
    * Stats properties allowed for operations.
    * @type {Array.<string>}
    */
  make.CharacterStatus.ALLOWED_OPERATION = ['innerPeace', 'excite'];

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
    this.innerPeace -= this.innerPeace > 0 ?
        make.CharacterStatus.INNER_PEACE_DEPLETION_INCREMENT : 0;
    this.excite -= this.excite > 0 ?
        make.CharacterStatus.EXCITE_DEPLETION_INCREMENT : 0;

    this.updateStatusBars();
  };

  /** Incrementally depletes the stats. */
  make.CharacterStatus.prototype.updateStatusBars = function() {
    if (this.innerPeaceStatusBar) {
      this.innerPeaceStatusBar.setPercent(this.innerPeace);
    }
    if (this.exciteStatusBar) {
      this.exciteStatusBar.setPercent(this.excite);
    }
  };

  /**
   * Based on the character's status attributes, gets their emotional state.
   * @return {mamagotchi.EmotionalState}
   */
  make.CharacterStatus.prototype.getEmotionalStatus = function() {
    if (this.innerPeace > 66 && this.excite > 66) {
      return make.CharacterStatus.EmotionalState.HAPPY;
    } else if (this.innerPeace > 33 && this.excite > 33) {
      return make.CharacterStatus.EmotionalState.NEUTRAL;
    } else {
      return make.CharacterStatus.EmotionalState.UNHAPPY;
    }
  }

  /**
   * Status bar.
   * @param {string} emotyImageKey Key for image representing empty bar.
   * @param {string} fullImageKey Key for image representing full bar.
   * @param {?number} opt_startingStats The default value of the stats.
   * @constructor
   */
  make.StatusBar = function(emptyImageKey, fullImageKey, opt_startingStats) {
    var game = m.game;

    /**
     * The bar game object group.
     * @type {Phaser.Group}
     */
    this.bar = game.add.group();

    var emptyBar = game.add.sprite(0, 0, emptyImageKey);
    var barWidth = emptyBar.width;
    var barHeight = emptyBar.height;
    emptyBar.scale.setTo(0.5);
    this.bar.add(emptyBar);

    var bmd = game.add.bitmapData(barWidth, barHeight);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, barWidth, barHeight);

    /**
     * Crop rectangle for the bar.
     * @type {Phaser.Rectangle}
     */
    this.cropRectangle = game.add.sprite(0, 0, bmd);
    this.bar.add(this.cropRectangle);

    this.cropRectangle.scale.x = (opt_startingStats || 100) / 100;

    /**
     * The bar sprite.
     * @type {Phaser.Sprite}
     */
    this.barSprite = game.add.sprite(0, 0, fullImageKey);
    this.barSprite.scale.setTo(0.5);
    this.barSprite.crop(this.cropRectangle);
    this.bar.add(this.barSprite);
  };

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
    this.cropRectangle.scale.x = percentValue / 100;
    this.barSprite.updateCrop();
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
