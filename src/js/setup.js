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

  consts.MAMA = 'mama';
  consts.ARSENAL_BUTTON = 'arsenal-button';
  consts.ARSENAL_COFFEE = 'arsenal-coffee';
  consts.ARSENAL_CULTURE = 'arsenal-culture';
  consts.ARSENAL_MASSAGE = 'arsenal-massage';
  consts.ARSENAL_OFFSPRING = 'arsenal-offspring';

  return consts;
})();
