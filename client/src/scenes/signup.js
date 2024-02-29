import io from 'socket.io-client';
import FirebasePlugin from '../plugins/FirebasePlugin';

export default class Signup extends Phaser.Scene
{
    constructor() {
        super({
            key: 'Signup'
        });
    }

    preload ()
    {
        this.load.html('signupform', 'assets/html/signupform.html');
        this.load.plugin('FirebasePlugin', FirebasePlugin, true);
    }

    create ()
    {
        var firebaseApp = this.plugins.get('FirebasePlugin');
        console.log(firebaseApp);

        let scene = this.scene;

        // check if user already logged in
        /*firebaseApp.auth.onAuthStateChanged(user => {
            if (user) {
                console.log('Logged in as: ' + user.email);
                this.scene.start('Game');
            }
        });*/

        // Debugging pixel coords
        this.label = this.add.text(0, 0, '(x, y)', { fontFamily: '"Monospace"'});
        this.pointer = this.input.activePointer;

        const text = this.add.text(10, 10, 'Please login to play', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});

        const element = this.add.dom(650, 400).createFromCache('signupform');

        element.setPerspective(800);

        element.addListener('click');

        //this.socket = io('http://localhost:3000');

        element.on('click', function (event)
        {

            if (event.target.name === 'signupButton')
            {
                const inputUsername = this.getChildByName('username');
                const inputPassword = this.getChildByName('password');

                //  Have they entered anything?
                if (inputUsername.value !== '' && inputPassword.value !== '')
                {
                    const userData = JSON.stringify({
                        email: inputUsername.value,
                        password: inputPassword.value
                    });




                    const options = {
                        method: 'POST',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        body: userData,
                    }

                    fetch("http://localhost:3001/users/register",options).then(response =>{
                        console.log(JSON.stringify(response));
                    })

                    // response.then(data => {
                    // console.log(JSON.stringify(data));
                    // });
                    // Create new user account
                    firebaseApp.createUserWithEmailAndPassword(inputUsername.value, inputPassword.value)
                    .then(cred => {
                        console.log(cred);
                        scene.stop('Signup');
                    })
                    .catch(function(error) {
                        // Handle Errors here.
                        console.log(error);
                        var errorCode = error.code;
                        var errorMessage = error.message;
                    });
                }
                else
                {
                    //  Flash the prompt
                    this.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
                }
            }
        });

        this.loginButton = this.add.text(740, 220, 'Log in', { color: 'white', fontFamily: 'Arial', fontSize: '16px '});
            this.loginButton.setInteractive();
            this.loginButton.on('pointerover', () => {
                this.loginButton.setColor('yellow');
            });
            this.loginButton.on('pointerout', () => {
                this.loginButton.setColor('white');
            });
            this.loginButton.on('pointerdown', () => {
                element.setVisible(false);
                scene.start('Login');
            });
    }

    update ()
    {
        // Debugging pixel coords
        this.label.setText('(' + this.pointer.x + ', ' + this.pointer.y + ')');
    }

}

