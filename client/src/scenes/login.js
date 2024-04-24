import io from 'socket.io-client';
import FirebasePlugin from '../plugins/FirebasePlugin';

export default class Login extends Phaser.Scene
{
    constructor() {
        super({
            key: 'Login'
        });
    }

    preload ()
    {
        this.load.html('nameform', 'assets/html/loginform.html');
        this.load.plugin('FirebasePlugin', FirebasePlugin, true);
        this.load.image('bg', 'assets/bgtest.png');
    }

    create (loginFlag)
    {
        this.bg = this.add.image(0, 0, 'bg');
        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));
        let flag = true;
        flag = loginFlag;
        var firebaseApp = this.plugins.get('FirebasePlugin');
        console.log(firebaseApp);

        let scene = this.scene;

        // check if user already logged in
        firebaseApp.auth.onAuthStateChanged(user => {
            console.log(flag);
            if (user && flag) {
                console.log('Logged in as: ' + user.email);
                this.scene.start('MainMenu', loginFlag);
                flag = false;
            }
        });

        this.pointer = this.input.activePointer;

        const text = this.add.text(10, 10, 'Please login to play', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});

        const element = this.add.dom(650, 400).createFromCache('nameform');

        element.setPerspective(800);

        element.addListener('click');

        element.on('click', function (event)
        {

            if (event.target.name === 'loginButton')
            {
                const inputUsername = this.getChildByName('username');
                const inputPassword = this.getChildByName('password');

                //  Have they entered anything?
                if (inputUsername.value !== '' && inputPassword.value !== '')
                {
                    // Sign in
                    firebaseApp.signInWithEmailAndPassword(inputUsername.value, inputPassword.value)
                    .then(cred => {
                        console.log(cred);   
                        this.scene.scene.start('MainMenu', loginFlag);
                    })
                    .catch(function(error) {
                        // Handle Errors here
                        console.log(scene);
                        text.setText(`Error: Invalid username/password`);
                        console.log(error);
                    });
                }
                else
                {
                    //  Flash the prompt
                    this.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
                }
            }

            if (event.target.name === 'forgotButton')
            {
                element.setVisible(false);
                scene.start('ForgotPassword');
            }
        });

        this.signupButton = this.add.text(740, 220, 'Sign up', { color: 'white', fontFamily: 'Arial', fontSize: '16px '});
        this.signupButton.setInteractive();
        this.signupButton.on('pointerover', () => {
            this.signupButton.setColor('yellow');
        });
        this.signupButton.on('pointerout', () => {
            this.signupButton.setColor('white');
        });
        this.signupButton.on('pointerdown', () => {
            element.setVisible(false);
            scene.start('Signup');
        });
    }

    update ()
    {

    }

}

