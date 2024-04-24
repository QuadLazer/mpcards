import io from 'socket.io-client';
import FirebasePlugin from '../plugins/FirebasePlugin';

export default class ForgotPassword extends Phaser.Scene
{
    constructor() {
        super({
            key: 'ForgotPassword'
        });
    }

    preload ()
    {
        this.load.html('ForgotPassForm', 'assets/html/forgotpassform.html');
        this.load.plugin('FirebasePlugin', FirebasePlugin, true);
        this.load.image('bg', 'assets/bgtest.png');
        this.load.image('exit', 'assets/exitArrow.png');
    }

    create (loginFlag)
    {
        this.bg = this.add.image(0, 0, 'bg');
        this.exit = this.add.image(60, 100, 'exit').setScale(0.75, 0.75).setInteractive();
        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));
        let firebaseApp = this.plugins.get('FirebasePlugin');

        const infoText = this.add.text(1070, 200, 'Enter your email and we\'ll send a link to reset your password.',
        {fontSize: '36px', fontFamily: 'Woodchuck'}).setOrigin(1, 0);
        infoText.setStroke('#000000', 6);
        const errorText = this.add.text(1115, 310, 'Error: Enter a valid email',
        {fontSize: '36px', fontFamily: 'Woodchuck'}).setOrigin(1, 0).setVisible(false);
        errorText.setStroke('#000000', 6);

        this.pointer = this.input.activePointer;

        this.exit.on('pointerup', function (pointer) {
            console.log("I was clicked!");
            this.scene.start('Login');
        }, this)

        const element = this.add.dom(650, 400).createFromCache('ForgotPassForm');

        element.setPerspective(800);

        element.addListener('click');

        //this.socket = io('http://localhost:3000');

        element.on('click', function (event)
        {

            if (event.target.name === 'sendButton')
            {
                const inputEmail = this.getChildByName('email');

                //  Have they entered anything?
                if (inputEmail.value !== '')
                {
                    firebaseApp.sendPasswordResetEmail(inputEmail.value).then(() => {
                        console.log("Email sent");
                        this.scene.scene.start('Login');
                    }).catch((error) => {
                        console.log(error);
                        errorText.setVisible(true);
                    });
                }
                else {
                    errorText.setVisible(true);
                }
            }

        });
    }

    update ()
    {
        // Debugging pixel coords

    }

}