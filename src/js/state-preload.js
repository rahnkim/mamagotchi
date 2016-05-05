// Game preload state methods.

/* global mamagotchi */

/** Parent submodule. */
mamagotchi.state = mamagotchi.state || {};

/**
 * mamagotchi state preload submodule.
 * REQUIRES mamagotchi.consts submodule.
 */
mamagotchi.state.preload = (function(m) {
  var preloadState = {
    /** Phaser preload function. */
    preload: function() {
      var logo = this.add.sprite(
        this.game.world.centerX, this.game.world.centerY - 20, 'logo');
      logo.anchor.setTo(0.5);
      logo.scale.setTo(0.5);

      var preloadBar = this.add.sprite(
        (1280 - 900) / 2, this.game.world.centerY + 128, 'preloadBar');
      preloadBar.anchor.setTo(0, 0.5);
      this.load.setPreloadSprite(preloadBar);
      // Note: To test the loading bar, load extra HUGE image files deliberately.

      var consts = m.consts;

      this.load.image(
        'background', consts.IMG_PATH + 'background-placeholders-1.jpg');
      this.load.spritesheet(consts.DAD,
        consts.IMG_PATH + 'spritesheet-dad-180x320x2.png', 180, 320);
      this.load.spritesheet(consts.MAMA,
        consts.IMG_PATH + 'spritesheet-mom-330x560x8.png', 330, 560);
      this.load.spritesheet(consts.ROBOT,
        consts.IMG_PATH + 'spritesheet-robot-290x590x2.png', 290, 590);
      this.load.image(
        consts.REAR_FOREGROUND, consts.IMG_PATH + 'foreground-rear.png');
      this.load.spritesheet(consts.MEDIUM_TOTORO,
        consts.IMG_PATH + 'spritesheet-totoro-medium-140x170x2.png', 140, 170);
      this.load.spritesheet(consts.CHIBI_TOTORO,
        consts.IMG_PATH + 'spritesheet-totoro-chibi-60x90x2.png', 60, 90);
      this.load.image(
        consts.FRONT_FOREGROUND, consts.IMG_PATH + 'foreground-front.png');
      this.load.image(
        consts.PEACE_BAR_EMPTY, consts.IMG_PATH + 'bar-inner-peace-empty.png');
      this.load.image(
        consts.PEACE_BAR_FULL, consts.IMG_PATH + 'bar-inner-peace-full.png');
      this.load.image(
        consts.EXCITE_BAR_EMPTY, consts.IMG_PATH + 'bar-excite-empty.png');
      this.load.image(
        consts.EXCITE_BAR_FULL, consts.IMG_PATH + 'bar-excite-full.png');

      this.load.image(consts.ARSENAL_BUTTON,
          consts.IMG_PATH + consts.ARSENAL_BUTTON + consts.PNG);

      this.load.image(consts.ARSENAL_COFFEE,
          consts.IMG_PATH + consts.ARSENAL_COFFEE + consts.PNG);
      this.load.image(consts.ARSENAL_CULTURE,
          consts.IMG_PATH + consts.ARSENAL_CULTURE + consts.PNG);
      this.load.image(consts.ARSENAL_MASSAGE,
          consts.IMG_PATH + consts.ARSENAL_MASSAGE + consts.PNG);
      this.load.image(consts.ARSENAL_OFFSPRING,
          consts.IMG_PATH + consts.ARSENAL_OFFSPRING + consts.PNG);
    },

    /** Phaser create function. */
    create: function() {
      this.state.start('mamagotchiGame');
    }
  };

  return preloadState;
})(mamagotchi);
