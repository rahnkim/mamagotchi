// character-events.js contains character event definitions.

/* global mamagotchi */

/**
 * mamagotchi characterEvents submodule.
 * REQUIRES mamagotchi.consts and mamagotchi.make submodules.
 */
mamagotchi.characterEvents = (function(m) {
  var characterEvents = {};

  /**
   * Events available in the arsenal.
   * @const
   * @type {!Array.<{key: string, event: mamagotchi.CharacterEvent}>}
   */
  characterEvents.ARSENAL = [
    {
      key: m.consts.ARSENAL_COFFEE,
      event: /** mamagotchi.CharacterEvent */ {
        description: 'Mama gets a satisfactory dose of delicious coffee.',
        stats: new m.make.CharacterStatus(10, 20)
      }
    }, {
      key: m.consts.ARSENAL_MASSAGE,
      event: /** mamagotchi.CharacterEvent */ {
        description: 'Mama gets her tired muscles worked out by a top notch' +
            ' massage therapist.',
        stats: new m.make.CharacterStatus(20, 5)
      }
    }, {
      key: m.consts.ARSENAL_OFFSPRING,
      event: /** mamagotchi.CharacterEvent */ {
        description: 'One of mama\'s offspring comes around for a visit.',
        stats: new m.make.CharacterStatus(-10, 25)
      }
    }, {
      key: m.consts.ARSENAL_CULTURE,
      event: /** mamagotchi.CharacterEvent */ {
        description:
            'Mama indulges in one of her favorite arts & culture DVDs.',
        stats: new m.make.CharacterStatus(10, 10)
      }
    }
  ];

  /**
   * Events available in the automated event bot.
   * @const
   * @type {!Array.<mamagotchi.CharacterEvent>}
   */
  characterEvents.BOT = [];

  return characterEvents;
})(mamagotchi);
