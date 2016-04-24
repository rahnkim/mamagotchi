/** Namespace object. */
var mamagotchi = {
  init: {},
  characterActions: {},
  consts: {},
  events: {},
  game: null,
  objects: {}
};

// Constants.
mamagotchi.consts.IMG_PATH = 'assets/images/';
mamagotchi.consts.PNG = '.png';

mamagotchi.consts.MAMA = 'mama';
mamagotchi.consts.ARSENAL_BUTTON = 'arsenal-button';
mamagotchi.consts.ARSENAL_COFFEE = 'arsenal-coffee';
mamagotchi.consts.ARSENAL_CULTURE = 'arsenal-culture';
mamagotchi.consts.ARSENAL_MASSAGE = 'arsenal-massage';
mamagotchi.consts.ARSENAL_OFFSPRING = 'arsenal-offspring';

mamagotchi.consts.ARSENAL_MODAL_TITLE_FONT = 'Arial';

/** Phaser init function. */
mamagotchi.init.init = function() {
  var game = mamagotchi.game;

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = game.scale.pageAlignVertically = true;
};

/** Phaser preload function. */
mamagotchi.init.preload = function() {
  var game = mamagotchi.game;
  var consts = mamagotchi.consts;

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
};

/** Phaser create function. */
mamagotchi.init.create = function() {
  var game = mamagotchi.game;
  var objects = mamagotchi.objects;

  objects.background = game.add.image(0, 0, 'background');

  // Mama general settings.
  objects.mama = game.add.sprite(
      game.world.centerX, game.world.centerY + 50, mamagotchi.consts.MAMA);
  objects.mama.scale.setTo(0.7);
  objects.mama.anchor.setTo(0.5);

  // Mama input handler settings.
  objects.mama.inputEnabled = true;
  objects.mama.pixelPerfectClick = true;
  objects.mama.input.enableDrag();
  objects.mama.input.allowVerticalDrag = false;

  // Mama custom attributes.
  objects.mama.customParams = {innerPeace: 100, fun: 100};

  // Action arsenal button.
  objects.arsenalButton = game.add.sprite(
      game.world._width - 150, 70, mamagotchi.consts.ARSENAL_BUTTON);
  objects.arsenalButton.anchor.setTo(0.5);
  objects.arsenalButton.inputEnabled = true;

  // Action arsenal modal should be the last object created so that
  // it stays on top/the front.
  objects.arsenalModal = mamagotchi.init.createArsenalModal();
  objects.arsenalButton.events.onInputDown.add(function(sprite, event) {
    objects.arsenalModal.visible = true;
  }, this);
};

/**
 * Helper function for Phaser create function that creates the action arsenal
 * modal.
 * @return {Phaser.Group} The modal that is created.
 */
mamagotchi.init.createArsenalModal = function() {
  var game = mamagotchi.game;

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
  innerModal.events.onInputDown.add(function(element, pointer) {
    modal.visible = false;
  }, this, 2);
  modal.add(innerModal);
  modal.add(modalBackdrop);

  var fontFamily = mamagotchi.consts.ARSENAL_MODAL_TITLE_FONT;
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

  var actionOptions = mamagotchi.characterActions.ARSENAL;
  var sidePadding = 50;
  var optionWidth = 200;
  // 1 padding on either side, length-1 spaces in betweens
  var spacing = (game.world._width -
      (sidePadding * 2 + optionWidth * actionOptions.length))/
      (actionOptions.length - 1);
  var offset = sidePadding + optionWidth/2;
  actionOptions.forEach(function(action) {
    var option = game.add.image(offset, game.world.centerY + 75, action.key);
    option.inputEnabled = true;
    option.pixelPerfectClick = true;
    option.priorityID = 10;
    option.events.onInputDown.add(
        mamagotchi.events.fireArsenalAction, option, 1,
        action.description, action.innerPeace, action.fun);
    option.bringToTop()
          .anchor.setTo(0.5);
    modal.add(option);
    offset += spacing + optionWidth;
  });

  modal.visible = false;
  return modal;
};

/** Phaser update function. */
mamagotchi.init.update = function() {
  var mama = mamagotchi.objects.mama;
  mama.customParams.innerPeace -= mama.customParams.innerPeace > 0 ? 0.001 : 0;
  mama.customParams.fun -= mama.customParams.fun > 0 ? 0.001 : 0;
  console.log('mama\'s inner peace:', mama.customParams.innerPeace);
  console.log('mama\'s fun:', mama.customParams.fun);
};

/** Phaser render function. */
mamagotchi.init.render = function() {
};

/**
 * Actions available in the arsenal.
 * @const
 * @type {Array.<?>}
 */
mamagotchi.characterActions.ARSENAL = [
  {
    key: mamagotchi.consts.ARSENAL_COFFEE,
    description: 'Mama gets a satisfactory dose of delicious coffee.',
    innerPeace: 10,
    fun: 20
  }, {
    key: mamagotchi.consts.ARSENAL_MASSAGE,
    description: 'Mama gets her tired muscles worked out by a top notch' +
         'massage therapist.',
    innerPeace: 20,
    fun: 5
  }, {
    key: mamagotchi.consts.ARSENAL_OFFSPRING,
    description: 'One of mama\'s offspring comes around for a visit.',
    innerPeace: -10,
    fun: 25
  }, {
    key: mamagotchi.consts.ARSENAL_CULTURE,
    description: 'Mama indulges in one of her favorite arts & culture DVDs.',
    innerPeace: 10,
    fun: 10
  }
];

/**
 * Actions available in the automated action bot.
 * @const
 * @type {Array.<?>}
 */
mamagotchi.characterActions.BOT = [];

/**
 * On selecting arsenal action, causes mama's stats to change and displays
 * action description.
 * @param {?} sprite
 * @param {?} event
 * @param {string} description Description of the arsenal action.
 * @param {number} innerPeace Number to manipulate mama's inner peace stats.
 * @param {number} fun Number to manipulate mama's fun stats.
 */
mamagotchi.events.fireArsenalAction =
    function(sprite, event, description, innerPeace, fun) {
  var mamaCustom = mamagotchi.objects.mama.customParams;
  var newInnerPeace = mamaCustom.innerPeace + innerPeace;
  var newFun = mamaCustom.fun + fun;
  mamaCustom.innerPeace = newInnerPeace <= 100 ? newInnerPeace : 100;
  mamaCustom.fun = newFun <= 100 ? newFun : 100;
  mamagotchi.objects.arsenalModal.visible = false;
  // Pop up action description
  // Pop up inner peace and fun diff
  console.log('mama\'s inner peace AFTER:', mamaCustom.innerPeace);
  console.log('mama\'s fun AFTER:', mamaCustom.fun);
}

/**
 * 'mamagotchi' game.
 * @type {Phaser.Game}
 */
mamagotchi.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'mamagotchi', {
    init: mamagotchi.init.init,
    preload: mamagotchi.init.preload,
    create: mamagotchi.init.create,
    update: mamagotchi.init.update,
    render: mamagotchi.init.render
});