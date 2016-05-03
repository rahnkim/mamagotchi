// Game initialization.

/* global mamagotchi, Phaser */

/**
 * mamagotchi game initialization.
 * REQUIRES mamagotchi.consts and mamagotchi.make and
 *    mamagotchi.characterEvents and all mamagotchi.state submodules.
 */
mamagotchi.game = new Phaser.Game(1280, 720, Phaser.AUTO);
mamagotchi.game.state.add('mamagotchiBoot', mamagotchi.state.boot);
mamagotchi.game.state.add('mamagotchiPreload', mamagotchi.state.preload);
mamagotchi.game.state.add('mamagotchiGame', mamagotchi.state.game);
mamagotchi.game.state.start('mamagotchiBoot');
