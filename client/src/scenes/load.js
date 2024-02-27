export default class Load extends Phaser.Scene {
    constructor() {
        super('Load')
    }

    preload() {
        this.load.image('menu','assets/mainMenu.png');
    }

    create () {
        this.add.image(600,400, 'menu')
        this.input.on('pointerdown', () => this.scene.start('Game'));
    }
}
