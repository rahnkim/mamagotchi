// Game game state methods.

/* global mamagotchi, Phaser */

/** Parent submodule. */
mamagotchi.state = mamagotchi.state || {};

/**
 * mamagotchi state game submodule.
 * REQUIRES mamagotchi.consts and mamagotchi.make and
 *    mamagotchi.characterEvents submodules.
 */
mamagotchi.state.game = (function(m) {
  var objects = {};

  var gameState = {
    /** Phaser create function. */
    create: function() {
      objects.background = this.add.image(0, 0, 'background');
      objects.background.scale.setTo(0.5);

      // Dad sprite.
      objects.dad = this.add.sprite(1112, 217, m.consts.DAD);
      objects.dad.scale.setTo(0.5);
      objects.dad.anchor.setTo(0.5);
      objects.dad.animations.add(
        'blink', createBlinkAnimationArray(0, 1, 28), 5, true);
      objects.dad.play('blink');

      // Robot sprite.
      objects.robot = this.add.sprite(215, 312, m.consts.ROBOT);
      objects.robot.scale.setTo(0.5);
      objects.robot.anchor.setTo(0.5);

      // Rear foreground.
      objects.rearForeground = this.add.image(0, 0, m.consts.REAR_FOREGROUND);
      objects.rearForeground.scale.setTo(0.5);

      // Medium Totoro sprite.
      objects.mediumTotoro =
          this.add.sprite(1109, 563, m.consts.MEDIUM_TOTORO);
      objects.mediumTotoro.anchor.setTo(0.5, 0.95); // Anchor at feet.

      // Medium Totoro blink animation.
      objects.mediumTotoro.animations.add(
        'blink', createBlinkAnimationArray(0, 1, 12), 4, true);
      objects.mediumTotoro.play('blink');

      // Medium Totoro resting motion.
      objects.mediumTotoro.scale.setTo(0.52, 0.48);
      objects.mediumTotoro.angle = -3;
      this.add.tween(objects.mediumTotoro).to(
          {angle: 1}, 1100, "Quad.easeInOut", true, 0, -1, true);
      this.add.tween(objects.mediumTotoro.scale).to(
          {x: 0.5, y: 0.5}, 550, "Quad.easeInOut", true, 0, -1, true);

      // Chibi Totoro sprite.
      objects.chibiTotoro = this.add.sprite(1070, 562, m.consts.CHIBI_TOTORO);
      objects.chibiTotoro.anchor.setTo(0.5, 0.95); // Anchor at feet.

      // Chibi Totoro blink animation.
      objects.chibiTotoro.animations.add(
        'blink', createBlinkAnimationArray(0, 1, 12), 5, true);
      objects.chibiTotoro.play('blink');

      // Chibi Totoro resting motion.
      objects.chibiTotoro.scale.setTo(0.55, 0.45);
      objects.chibiTotoro.angle = -3;
      this.add.tween(objects.chibiTotoro).to(
          {angle: 3}, 1100, "Quad.easeInOut", true, 0, -1, true);
      this.add.tween(objects.chibiTotoro.scale).to(
          {x: 0.5, y: 0.5}, 550, "Quad.easeInOut", true, 0, -1, true);

      // Front foreground.
      objects.frontForeground =
          this.add.image(0, 0, m.consts.FRONT_FOREGROUND);
      objects.frontForeground.scale.setTo(0.5);

      // Mama sprite general settings.
      objects.mama = this.add.sprite(
          this.world.centerX, this.world.centerY + 223, m.consts.MAMA);
      objects.mama.scale.setTo(0.5);
      objects.mama.anchor.setTo(0.5, 1); // Anchor at feet.
      objects.mama.customParams = {};

      // Mama blink animations.
      objects.mama.animations.add(
        'happyBlink', createBlinkAnimationArray(0, 1), 5, true);
      objects.mama.animations.add(
        'neutralBlink', createBlinkAnimationArray(2, 3), 5, true);
      objects.mama.animations.add(
        'unhappyBlink', createBlinkAnimationArray(4, 5), 5, true);
      objects.mama.play('happyBlink');

      // Mama resting motion.
      objects.mama.scale.setTo(0.50125, 0.49875);
      objects.mama.angle = -0.125;
      this.add.tween(objects.mama).to(
          {angle: 0.125}, 1400, "Quad.easeInOut", true, 0, -1, true);
      this.add.tween(objects.mama.scale).to(
          {x: 0.5, y: 0.5}, 700, "Quad.easeInOut", true, 0, -1, true);

      // Mama input handler settings.
      objects.mama.inputEnabled = true;
      objects.mama.pixelPerfectClick = true;
      objects.mama.input.enableDrag();
      objects.mama.input.allowVerticalDrag = false;

      // Mama drag event sprite settings.
      objects.mama.customParams.lastX = objects.mama.position.x;
      objects.mama.events.onDragStart.add(function() {
        objects.mama.animations.stop();
      })

      // Add directional warp to mama sprite.
      objects.mama.events.onDragUpdate.add(function(sprite) {
        var diff = sprite.x - objects.mama.customParams.lastX;
        if (diff < -5) {
          objects.mama.frame = 6; // Fly left.
        } else if (diff > 5) {
          objects.mama.frame = 7; // Fly right.
        } else {
          objects.mama.frame = 2; // Neutral still.
        }
        objects.mama.customParams.lastX = sprite.x;
      }, this);

      // Limit mama's drag movement to left and right bounds.
      objects.mama.events.onDragStop.add(function(sprite) {
        objects.mama.frame = 2;

        var RIGHT_BOUND = 1000;
        var LEFT_BOUND = 100;
        if (sprite.x > RIGHT_BOUND) {
          objects.mama.customParams.lastX = sprite.x = RIGHT_BOUND;
        } else if (sprite.x < LEFT_BOUND) {
          objects.mama.customParams.lastX = sprite.x = LEFT_BOUND;
        } else {
          objects.mama.customParams.lastX = sprite.x;
        }
      }, this, 0);

      // Status bars.
      var barsLeftMargin = 183;
      var barsTopMargin = 32;
      var barsGap = 45;
      objects.innerPeaceStatusBar = new m.make.StatusBar(
        m.consts.PEACE_BAR_EMPTY, m.consts.PEACE_BAR_FULL,
        m.consts.STARTING_STATS);
      objects.innerPeaceStatusBar.setPosition(barsLeftMargin, barsTopMargin);
      objects.exciteStatusBar = new m.make.StatusBar(
        m.consts.EXCITE_BAR_EMPTY, m.consts.EXCITE_BAR_FULL,
        m.consts.STARTING_STATS);
      objects.exciteStatusBar.setPosition(
          barsLeftMargin, barsTopMargin + barsGap);

      // Mama status.
      objects.mama.customParams.Status = new m.make.CharacterStatus(
        m.consts.STARTING_STATS, m.consts.STARTING_STATS,
        objects.innerPeaceStatusBar, objects.exciteStatusBar);

      objects.mamaStatsDepleter = this.time.events.loop(
          /* delay */ Phaser.Timer.SECOND * 3,
          /* callback */ objects.mama.customParams.Status.deplete,
          /* callback context */ objects.mama.customParams.Status);

      // Event arsenal button.
      objects.arsenalButton = this.add.sprite(
          this.world._width - 150, 70, m.consts.ARSENAL_BUTTON);
      objects.arsenalButton.anchor.setTo(0.5);
      objects.arsenalButton.inputEnabled = true;

      // Event arsenal modal should be the last object created so that
      // it stays on top/the front.
      objects.arsenalModal = createArsenalModal();
      objects.arsenalButton.events.onInputDown.add(function() {
        objects.arsenalModal.visible = true;
      }, this);
    },
    update: function() {
      setMamaIdleAnimation();
    }
  };

  /**
   * Given rest frame order and blink frame order, creates and returns an array
   * that represents a blink for 5fps animation.
   * @param {number} restFrame Rest frame order.
   * @param {number} blinkFrame Blink frame order.
   * @param {number} opt_restFrameCount Number of frames to rest for.
   * @return {Array.<number>} Array to use for animation.
   */
  function createBlinkAnimationArray(
      restFrame, blinkFrame, opt_restFrameCount) {
    var restFrames = opt_restFrameCount ? opt_restFrameCount : 25;
    var array = [];
    for (var i = 0; i < restFrames; ++i) {
      array.push(restFrame);
    }

    // Insert the blink frame at a random index.
    array.splice(Math.floor((Math.random() * array.length)), 0, blinkFrame);
    return array;
  }

  /** Gets mama's emotional status and sets appropriate blink animation. */
  function setMamaIdleAnimation() {
    if (objects.mama.customParams.Status.getEmotionalStatus() ===
          m.make.CharacterStatus.EmotionalState.HAPPY) {
      objects.mama.play('happyBlink');
    } else if (objects.mama.customParams.Status.getEmotionalStatus() ===
          m.make.CharacterStatus.EmotionalState.NEUTRAL) {
      objects.mama.play('neutralBlink');
    } else {
      objects.mama.play('unhappyBlink');
    }
  }

  /**
   * Helper function for Phaser create function that creates the event arsenal
   * modal.
   * @return {Phaser.Group} The modal that is created.
   */
  function createArsenalModal() {
    var game = m.game;

    var modal = game.add.group();
    var modalBackdropColor = '0x000000';
    var modalBackdropOpacity = 0.7;
    var modalBackdrop = game.add.graphics(game.width, game.height);
    modalBackdrop.beginFill(modalBackdropColor, modalBackdropOpacity);
    modalBackdrop.x = modalBackdrop.y = 0;
    modalBackdrop.drawRect(0, 0, game.width, game.height);

    var innerModal = game.add.sprite(0, 0);
    innerModal.inputEnabled = true;
    innerModal.width = game.width;
    innerModal.height = game.height;
    innerModal.input.priorityID = 0;
    innerModal.events.onInputDown.add(function() {
      modal.visible = false;
    }, this, 2);
    modal.add(innerModal);
    modal.add(modalBackdrop);

    var fontFamily = m.consts.ARSENAL_MODAL_TITLE_FONT;
    var fontSize = 100;
    var fontColor = '0xff69b4';
    var fontStroke = modalBackdropColor;
    var fontStrokeThickness = 1;
    var modalTitleText = 'Do a Thing';
    var modalTitle = game.add.text(
        game.world.centerX,
        game.world.centerY - 125,
        modalTitleText, {
          font: fontSize + 'px ' + fontFamily,
          fill: '#' + fontColor.replace('0x', ''),
          stroke: '#' + fontStroke.replace('0x', ''),
          strokeThickness: fontStrokeThickness,
          align: 'center'
        });
    modalTitle.bringToTop()
              .anchor.setTo(0.5);
    modal.add(modalTitle);

    var eventOptions = m.characterEvents.ARSENAL;
    var sidePadding = 50;
    var optionWidth = 200;
    // 1 padding on either side, length-1 spaces in betweens
    var spacing = (game.world._width -
        (sidePadding * 2 + optionWidth * eventOptions.length)) /
        (eventOptions.length - 1);
    var offset = sidePadding + optionWidth / 2;
    eventOptions.forEach(function(event) {
      var option = game.add.image(offset, game.world.centerY + 75, event.key);
      option.inputEnabled = true;
      option.pixelPerfectClick = true;
      option.priorityID = 10;
      option.events.onInputDown.add(function(
          _s, _e, /** {!mamagotchi.CharacterEvent} */ characterEvent) {
        executeCharacterEvent(characterEvent);
      }, option, 1, event.event);
      option.bringToTop()
            .anchor.setTo(0.5);
      modal.add(option);
      offset += spacing + optionWidth;
    });

    modal.visible = false;
    return modal;
  }

  /**
   * "Executes" character event, causing mama's stats to change and displaying
   * event description.
   * @param {!mamagotchi.CharacterEvent} characterEvent Details of the character
   *    event/action.
   */
  function executeCharacterEvent(characterEvent) {
    var mamaStatus = objects.mama.customParams.Status;
    mamaStatus.modifyWith(characterEvent.stats);
    objects.arsenalModal.visible = false;
    console.log(characterEvent.description);
    console.log('mama\'s stats {inner peace:', mamaStatus.innerPeace + ', excite:',
        mamaStatus.excite + '}');
    // Pop up event description
    // Pop up inner peace and excite diff
  }

  return gameState;
})(mamagotchi);
