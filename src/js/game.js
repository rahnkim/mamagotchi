// Game methods and initializations.

/* global mamagotchi, Phaser */

/**
 * mamagotchi game submodule.
 * REQUIRES mamagotchi.consts and mamagotchi.make and
 *    mamagotchi.characterEvents submodules.
 */
mamagotchi.game = (function(m) {
  var objects = {};

  /** Phaser init function. */
  function init() {
    var game = m.game;

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = game.scale.pageAlignVertically = true;
  }

  /** Phaser preload function. */
  function preload() {
    var game = m.game;
    var consts = m.consts;

    game.load.image('background', consts.IMG_PATH + 'background.png');
    game.load.image(consts.MAMA, consts.IMG_PATH + consts.MAMA + consts.PNG);
    game.load.image(consts.ARSENAL_BUTTON,
        consts.IMG_PATH + consts.ARSENAL_BUTTON + consts.PNG);

    game.load.image(consts.ARSENAL_COFFEE,
        consts.IMG_PATH + consts.ARSENAL_COFFEE + consts.PNG);
    game.load.image(consts.ARSENAL_CULTURE,
        consts.IMG_PATH + consts.ARSENAL_CULTURE + consts.PNG);
    game.load.image(consts.ARSENAL_MASSAGE,
        consts.IMG_PATH + consts.ARSENAL_MASSAGE + consts.PNG);
    game.load.image(consts.ARSENAL_OFFSPRING,
        consts.IMG_PATH + consts.ARSENAL_OFFSPRING + consts.PNG);
  }

  /** Phaser create function. */
  function create() {
    var game = m.game;

    objects.background = game.add.image(0, 0, 'background');

    // Mama general settings.
    objects.mama = game.add.sprite(
        game.world.centerX, game.world.centerY + 50, m.consts.MAMA);
    objects.mama.scale.setTo(0.7);
    objects.mama.anchor.setTo(0.5);

    // Mama input handler settings.
    objects.mama.inputEnabled = true;
    objects.mama.pixelPerfectClick = true;
    objects.mama.input.enableDrag();
    objects.mama.input.allowVerticalDrag = false;

    // Status bars
    objects.innerPeaceStatusBar = new m.make.StatusBar();
    objects.innerPeaceStatusBar.setPosition(300, 50);
    objects.funStatusBar = new m.make.StatusBar();
    objects.funStatusBar.setPosition(300, 150);

    // Mama custom attributes.
    objects.mama.customParams = new m.make.CharacterStatus(
      100, 100, objects.innerPeaceStatusBar, objects.funStatusBar);

    // Event arsenal button.
    objects.arsenalButton = game.add.sprite(
        game.world._width - 150, 70, m.consts.ARSENAL_BUTTON);
    objects.arsenalButton.anchor.setTo(0.5);
    objects.arsenalButton.inputEnabled = true;

    // Event arsenal modal should be the last object created so that
    // it stays on top/the front.
    objects.arsenalModal = createArsenalModal();
    objects.arsenalButton.events.onInputDown.add(function() {
      objects.arsenalModal.visible = true;
    }, this);
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

  /** Phaser update function. */
  function update() {
    objects.mama.customParams.deplete();
  }

  /**
   * "Executes" character event, causing mama's stats to change and displaying
   * event description.
   * @param {!mamagotchi.CharacterEvent} characterEvent Details of the character
   *    event/action.
   */
  function executeCharacterEvent(characterEvent) {
    var mamaStatus = objects.mama.customParams;
    mamaStatus.modifyWith(characterEvent.stats);
    objects.arsenalModal.visible = false;
    console.log(characterEvent.description);
    console.log('mama\'s stats {inner peace:', mamaStatus.innerPeace + ', fun:',
        mamaStatus.fun + '}');
    // Pop up event description
    // Pop up inner peace and fun diff
  }

  /**
   * 'mamagotchi' game.
   * @type {Phaser.Game}
   */
  var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'mamagotchi', {
    init: init,
    preload: preload,
    create: create,
    update: update
  });

  return game;
})(mamagotchi);
