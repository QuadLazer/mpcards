export default class Loading extends Phaser.Scene {
    constructor() {
        super('Loading');
        this.users = [];
        this.broadcastChannel = new BroadcastChannel('users');
        this.broadcastChannel.addEventListener('message', this.handleBroadcastMessage.bind(this));
    }

    preload() {
        this.load.image('bg', 'assets/bgtest.png');
        this.load.image('findingMatch', 'assets/loading_assets/loadingTitle.png');
        this.load.image('cancel', 'assets/loading_assets/cancelButton.png');
        this.load.spritesheet('loop', 'assets/loading_assets/loadingGifSprite.png', { frameWidth: 200, frameHeight: 200 });
        this.load.image('loopBorder', 'assets/loading_assets/loadingBorder.png');
    }

    create () {
        this.anims.create({
            key: "load",
            frameRate: 15,
            frames: this.anims.generateFrameNumbers("loop", { start: 0, end: 15 }),
            repeat: -1
        });

        

        this.addUser();
        

        this.bg = this.add.image(0, 0, 'bg');
        this.title = this.add.image(1000, 390, 'findingMatch').setScale(0.75, 0.75).setInteractive();
        this.cancel = this.add.image(330, 600, 'cancel').setScale(0.75, 0.75).setInteractive();
        this.loop = this.add.sprite(320, 360, 'loop').setScale(0.60, 0.60).setInteractive();
        this.loop.setDepth(1);
        this.loop.play("load");
        //this.loop.setStroke('#000000', 6);
        //this.loop.setShadow(4, 4, '#000000', 0);
        this.loopBorder = this.add.image(320, 360, 'loopBorder').setScale(0.75, 0.75).setInteractive();
        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));

        
        

        this.cancel.on('pointerup', function (pointer) {
            this.scene.start('MainMenu');
        }, this);
    }

    addUser() {
        const newUser = {id: Phaser.Math.RND.uuid()};
        this.users.push(newUser);
        console.log(`User ${newUser.id} is waiting for a game`);

        this.broadcastChannel.postMessage({type: 'joined', user: newUser});

        if(this.users.length ===2) {
            
            this.loadGame(this.users);
            this.users.length = 0;
            this.broadcastChannel.close();
 
        }

        //const check = JSON.parse(localStorage.getItem('users'))
        
    }

    checkUser() {
        const check = JSON.parse(localStorage.getItem('users'));
        if(this.users.length > 1) {
            //this.loadGame(this.users);
            localStorage.removeItem('users');
            this.loadGame(this.users);
        }

    }

    

    loadGame(users) {
        this.scene.start('Game',{users});
    }

    handleBroadcastMessage(event) {
        const message = event.data;
        if (message.type === 'joined') {
          this.users.push(message.user);
          if (this.users.length === 2) {
            this.loadGame(this.waitingUsers);
            this.users.length = 0;
            this.broadcastChannel.close();
          }
        }
      }
}
