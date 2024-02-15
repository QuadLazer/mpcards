export default class Controller {
    userTurn = true;
    constructor(scene) {
        this.render = (sprite) => {
            let button = scene.add.image(1170, 100, sprite).setScale(0.75, 0.75).setInteractive();
            return button;
        }

        this.turnCheck = () => {
            return this.userTurn;
        }

        this.nextTurn = () => {
            userTurn = !this.userTurn;
        }
    }
}