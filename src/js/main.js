/* global Phaser */

/** Namespace object. */
var mamagotchi = {
  init: {},
  characterEvents: {},
  consts: {},
  events: {},
  game: null,
  objects: {},
  utils: {}
};

/**
 * The character's stats with inner peace and fun properties.
 * @param {?number} innerPeace Character's "inner peace" stats.
 * @param {?number} fun Character's "fun" stats.
 * @constructor
 */
mamagotchi.utils.CharacterStats = function(innerPeace, fun) {
  this.innerPeace = innerPeace;
  this.fun = fun;
};

/**
 * Changes this stats by adding the given stats values.
 * @param {!mamagotchi.utils.CharacterStats} otherStats Stats to change this
 *    stats.
 */
mamagotchi.utils.CharacterStats.prototype.modifyWith = function(otherStats) {
  var newStat;
  for (var stat in otherStats) {
    if (this.hasOwnProperty(stat)) {
      newStat = this[stat] + otherStats[stat];
      if (newStat > 100) {
        this[stat] = 100;
      } else if (newStat < 0) {
        this[stat] = 0;
      } else {
        this[stat] = newStat;
      }
    }
  }
};

/** Incrementally depletes the stats. */
mamagotchi.utils.CharacterStats.prototype.deplete = function() {
  this.innerPeace -= this.innerPeace > 0 ? 0.001 : 0;
  this.fun -= this.fun > 0 ? 0.001 : 0;
};

/**
 * The character event object containing details of the event.
 * @typedef {Object} mamagotchi.CharacterEvent
 * @property {!string} description Event/action description.
 * @property {?mamagotchi.utils.CharacterStats} stats Impact on character's stats.
 * @property {?mamagotchi.CharacterEventCallback} callback Function to call
 *    on character event.
 */

 /**
  * Callback used by mamagotchi.CharacterEvent.
  * @callback mamagotchi.CharacterEventCallback
  */

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
  objects.mama.customParams = new mamagotchi.utils.CharacterStats(100, 100);

  // Event arsenal button.
  objects.arsenalButton = game.add.sprite(
      game.world._width - 150, 70, mamagotchi.consts.ARSENAL_BUTTON);
  objects.arsenalButton.anchor.setTo(0.5);
  objects.arsenalButton.inputEnabled = true;

  // Event arsenal modal should be the last object created so that
  // it stays on top/the front.
  objects.arsenalModal = mamagotchi.init.createArsenalModal();
  objects.arsenalButton.events.onInputDown.add(function() {
    objects.arsenalModal.visible = true;
  }, this);
};

/**
 * Helper function for Phaser create function that creates the event arsenal
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
  innerModal.events.onInputDown.add(function() {
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

  var eventOptions = mamagotchi.characterEvents.ARSENAL;
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
    option.events.onInputDown.add(
        mamagotchi.events.executeArsenalEvent, option, 1, event.event);
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
  mamagotchi.objects.mama.customParams.deplete();
};

/** Phaser render function. */
mamagotchi.init.render = function() {
};

/**
 * Events available in the arsenal.
 * @const
 * @type {!Array.<{key: string, event: mamagotchi.CharacterEvent}>}
 */
mamagotchi.characterEvents.ARSENAL = [
  {
    key: mamagotchi.consts.ARSENAL_COFFEE,
    event: /** mamagotchi.CharacterEvent */ {
      description: 'Mama gets a satisfactory dose of delicious coffee.',
      stats: new mamagotchi.utils.CharacterStats(10, 20)
    }
  }, {
    key: mamagotchi.consts.ARSENAL_MASSAGE,
    event: /** mamagotchi.CharacterEvent */ {
      description: 'Mama gets her tired muscles worked out by a top notch' +
          'massage therapist.',
      stats: new mamagotchi.utils.CharacterStats(20, 5)
    }
  }, {
    key: mamagotchi.consts.ARSENAL_OFFSPRING,
    event: /** mamagotchi.CharacterEvent */ {
      description: 'One of mama\'s offspring comes around for a visit.',
      stats: new mamagotchi.utils.CharacterStats(-10, 25)
    }
  }, {
    key: mamagotchi.consts.ARSENAL_CULTURE,
    event: /** mamagotchi.CharacterEvent */ {
      description: 'Mama indulges in one of her favorite arts & culture DVDs.',
      stats: new mamagotchi.utils.CharacterStats(10, 10)
    }
  }
];

/**
 * Events available in the automated event bot.
 * @const
 * @type {!Array.<mamagotchi.CharacterEvent>}
 */
mamagotchi.characterEvents.BOT = [];

/**
 * On selecting arsenal event, executes associated character event.
 * @param {?object} s Sprite that is clicked on.
 * @param {?object} e Event details.
 * @param {!mamagotchi.CharacterEvent} characterEvent Details of the character
 *    event/action.
 */
mamagotchi.events.executeArsenalEvent = function(s, e, characterEvent) {
  mamagotchi.events.executeCharacterEvent(characterEvent);
};

/**
 * "Executes" character event, causing mama's stats to change and displaying
 * event description.
 * @param {!mamagotchi.CharacterEvent} characterEvent Details of the character
 *    event/action.
 */
mamagotchi.events.executeCharacterEvent = function(characterEvent) {
  var mamaStats = mamagotchi.objects.mama.customParams;
  mamaStats.modifyWith(characterEvent.stats);
  mamagotchi.objects.arsenalModal.visible = false;
  console.log(characterEvent.description);
  console.log('mama\'s stats {inner peace:', mamaStats.innerPeace + ', fun:',
      mamaStats.fun + '}');
  // Pop up event description
  // Pop up inner peace and fun diff
};

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
