// setup.js sets up game code namespace, typedefs, and constants.

/** Main module. */
var mamagotchi = mamagotchi || {};

/**
 * The character event object containing details of the event.
 * @typedef {Object} mamagotchi.CharacterEvent
 * @property {!string} description Event/action description.
 * @property {?mamagotchi.utils.CharacterStatus} stats Impact on character's stats.
 * @property {?mamagotchi.CharacterEventCallback} callback Function to call
 *    on character event.
 */

 /**
  * Callback used by mamagotchi.CharacterEvent.
  * @callback mamagotchi.CharacterEventCallback
  */

/** mamagotchi consts submodule. */
mamagotchi.consts = (function() {
  var consts = {};

  consts.IMG_PATH = 'assets/images/';
  consts.PNG = '.png';

  consts.DAD = 'dad';
  consts.MAMA = 'mama';
  consts.ROBOT = 'robot';
  consts.CHIBI_TOTORO = 'chibiTotoro';
  consts.MEDIUM_TOTORO = 'mediumTotoro';

  consts.FRONT_FOREGROUND = 'frontForeground';
  consts.REAR_FOREGROUND = 'rearForeground';

  consts.PEACE_BAR_EMPTY = 'peaceBar_empty';
  consts.PEACE_BAR_FULL = 'peaceBar_full';
  consts.EXCITE_BAR_EMPTY = 'exciteBar_empty';
  consts.EXCITE_BAR_FULL = 'exciteBar_full';

  consts.ARSENAL_BUTTON = 'arsenal-button';
  consts.ARSENAL_COFFEE = 'arsenal-coffee';
  consts.ARSENAL_CULTURE = 'arsenal-culture';
  consts.ARSENAL_MASSAGE = 'arsenal-massage';
  consts.ARSENAL_OFFSPRING = 'arsenal-offspring';

  consts.ARSENAL_MODAL_TITLE_FONT = 'Arial';

  consts.STARTING_STATS = 80;

  return consts;
})();
