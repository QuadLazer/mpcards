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
    }

    create ()
    {
        var firebaseApp = this.plugins.get('FirebasePlugin');
        console.log(firebaseApp);

        let scene = this.scene;

        // check if user already logged in
        firebaseApp.auth.onAuthStateChanged(user => {
            if (user) {
                console.log('Logged in as: ' + user.email);
                this.scene.start('MainMenu');
            }
        });

        // Debugging pixel coords
        this.label = this.add.text(0, 0, '(x, y)', { fontFamily: '"Monospace"'});
        this.pointer = this.input.activePointer;

        const text = this.add.text(10, 10, 'Please login to play', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});

        const element = this.add.dom(650, 400).createFromCache('nameform');

        element.setPerspective(800);

        element.addListener('click');

        //this.socket = io('http://localhost:3000');

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
                        this.scene.scene.start('MainMenu');
                    })
                    .catch(function(error) {
                        // Handle Errors here
                        console.log(scene);
                        text.setText(`Error: Invalid username/password`);
                        console.log(error);
                    });

                    /*firebaseApp.createUserWithEmailAndPassword(inputUsername.value, inputPassword.value)
                    .then(cred => {
                        console.log(cred);
                    })
                    .catch(function(error) {
                        // Handle Errors here.
                        console.log(error);
                        var errorCode = error.code;
                        var errorMessage = error.message;
                    });*/
                }
                else
                {
                    //  Flash the prompt
                    this.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
                }
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
        // Debugging pixel coords
        this.label.setText('(' + this.pointer.x + ', ' + this.pointer.y + ')');
    }

}

