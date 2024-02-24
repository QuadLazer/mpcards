export default class Zone {
    constructor(scene) {
        this.renderZone = () => {
            let dropZone = scene.add.zone(674, 470, 150, 200).setRectangleDropZone(150, 200);
            dropZone.setData({ cards: 0, mascots: 0});
            dropZone.name = 'mascotArea'
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

        this.renderResourceZone = () => {
            let resDropZone = scene.add.zone(200, 470, 300, 200).setRectangleDropZone(300,200)
            scene.add.zone()
            resDropZone.setData({ resources: 0, pointSum: 0});
            resDropZone.name = 'resourceArea'
            return resDropZone;
        }

        this.renderResOutline = (resDropZone) => {
            let resDropZoneZoneOutline = scene.add.graphics();
            resDropZoneZoneOutline.lineStyle(4, 0xffffff);
            resDropZoneZoneOutline.strokeRect(resDropZone.x - resDropZone.input.hitArea.width / 2, resDropZone.y - resDropZone.input.hitArea.height / 2, resDropZone.input.hitArea.width, resDropZone.input.hitArea.height)
            //debugging
            //console.log((dropZone.x - dropZone.input.hitArea.width / 2) + " " + (dropZone.y - dropZone.input.hitArea.height / 2));
            //console.log(dropZone.input.hitArea.width + " " + dropZone.input.hitArea.height);
        }
    }
}