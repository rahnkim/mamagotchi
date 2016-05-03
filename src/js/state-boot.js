// Game boot state methods.

/* global mamagotchi, Phaser */

/** Parent submodule. */
mamagotchi.state = mamagotchi.state || {};

/**
 * mamagotchi state boot submodule.
 * REQUIRES mamagotchi.consts submodule.
 */
mamagotchi.state.boot = (function(m) {
  var bootState = {
    /** Phaser init function. */
    init: function() {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = this.scale.pageAlignVertically = true;
    },

    /** Phaser preload function. */
    preload: function() {
      var consts = m.consts;

      this.load.image('preloadBar', consts.IMG_PATH + 'loading-bar' + consts.PNG);
      this.load.image('logo', consts.IMG_PATH + consts.MAMA + consts.PNG);
    },

    /** Phaser create function. */
    create: function() {
      this.game.stage.backgroundColor = '#fff';

      // Launch next state.
      this.state.start('mamagotchiPreload');
    }
  };

  return bootState;
})(mamagotchi);
