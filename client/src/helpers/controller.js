export default class Controller {
    userTurn = true;
    constructor(scene) {
        this.render = () => {
            let button = scene.add.image(70, 220, 'testEndButton').setScale(0.75, 0.75).setInteractive();
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