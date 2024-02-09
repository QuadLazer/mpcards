export default class Controller {
    userTurn = true;
    constructor(scene) {
        this.render = (sprite) => {
            let button = scene.add.image(70, 220, sprite).setScale(0.75, 0.75).setInteractive();
            scene.add.text(30, 100, 'Your turn!', { fontFamily: '"Monospace"'});
            scene.add.text(30, 150, 'Opponent\'s turn!', { fontFamily: '"Monospace"'});
            return button;
        }
    }
}