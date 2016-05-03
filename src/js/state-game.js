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
      this.world.setBounds(0, 0, 1100, 720);
      this.physics.startSystem(Phaser.Physics.ARCADE);

      objects.background = this.add.image(0, 0, 'background');
      objects.background.scale.setTo(0.5);

      // Dad sprite.
      objects.dad = this.add.sprite(1112, 217, m.consts.DAD);
      objects.dad.scale.setTo(0.5);
      objects.dad.anchor.setTo(0.5);

      // Robot sprite
      objects.robot = this.add.sprite(215, 312, m.consts.ROBOT);
      objects.robot.scale.setTo(0.5);
      objects.robot.anchor.setTo(0.5);

      // Rear foreground
      objects.rearForeground = this.add.image(0, 0, m.consts.REAR_FOREGROUND);
      objects.rearForeground.scale.setTo(0.5);

      // Medium Totoro sprite

      // Chibi Totoro sprite

      // Front foreground

      // Mama sprite general settings.
      objects.mama = this.add.sprite(
          this.world.centerX + 70, this.world.centerY + 83, m.consts.MAMA);
      objects.mama.scale.setTo(0.5);
      objects.mama.anchor.setTo(0.5);
      objects.mama.customParams = {};

      // Mama sprite animations.
      objects.mama.animations.add(
        'happyBlink', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 2, true);
      objects.mama.animations.add(
        'neutralBlink', [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3], 2, true);
      objects.mama.animations.add(
        'unhappyBlink', [4, 4, 4, 4, 4, 4, 4, 4, 4, 5], 2, true);
      objects.mama.play('happyBlink');

      this.physics.arcade.enable(objects.mama);
      objects.mama.body.collideWorldBounds = true;

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
      objects.mama.events.onDragStop.add(function(sprite) {
        objects.mama.frame = 2;
        objects.mama.customParams.lastX = sprite.x;
      }, this, 0);

      // Status bars
      var barLabelStyle = {
        font: '40px ' + m.consts.ARSENAL_MODAL_TITLE_FONT,
        fill: 'black'
      };
      objects.innerPeaceStatusBar = new m.make.StatusBar(m.consts.STARTING_STATS);
      objects.innerPeaceStatusBar.setPosition(475, 50);
      var innerPeaceLabel = this.add.text(30, 50, 'Inner Peace:', barLabelStyle);
      innerPeaceLabel.anchor.setTo(0, 0.5);
      objects.exciteStatusBar = new m.make.StatusBar(m.consts.STARTING_STATS);
      objects.exciteStatusBar.setPosition(475, 125);
      var exciteLabel = this.add.text(30, 125, 'Excite:', barLabelStyle);
      exciteLabel.anchor.setTo(0, 0.5);

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
