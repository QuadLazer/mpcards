export default class Zone {
    constructor(scene) {
        this.renderZone = () => {
            let dropZone = scene.add.zone(674, 470, 900, 200).setRectangleDropZone(900, 200);
            dropZone.setData({ cards: 0 });
            return dropZone;
        };
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xffffff);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height)
            //debugging
            console.log((dropZone.x - dropZone.input.hitArea.width / 2) + " " + (dropZone.y - dropZone.input.hitArea.height / 2));
            console.log(dropZone.input.hitArea.width + " " + dropZone.input.hitArea.height);
        }
        this.renderHandZone = () => {
            let handZone = scene.add.zone(674, 670, 900, 200).setRectangleDropZone(900, 200);
            handZone.setData({ cards: 0 });
            return handZone;
        }
    }
}