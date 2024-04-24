import FirebasePlugin from '../plugins/FirebasePlugin.js'

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'EditProfile'
        });
    }

    preload() {
        this.load.image('testEndButton', 'assets/TestEnd.png');
        this.load.image('bg', 'assets/bgtest.png');
        this.load.image('profileHeader', 'assets/profile_assets/profile.png');
        this.load.image('username', 'assets/profile_assets/usernameHeader.png');
        this.load.image('email', 'assets/profile_assets/emailHeader.png');
        this.load.image('winCount', 'assets/profile_assets/winCountHeader.png');
        this.load.image('exit', 'assets/exitArrow.png');
        this.load.image('sampleAch1', 'assets/achievements_assets/sampleAch1.png');
        this.load.image('sampleAch2', 'assets/achievements_assets/sampleAch2.png');
        this.load.image('sampleAch3', 'assets/achievements_assets/sampleAch3.png');
        this.load.image('lockedAch', 'assets/achievements_assets/lockedAchIcon.png');
        this.load.html('editProfileForm', 'assets/html/editprofileform.html');
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg');
        this.exit = this.add.image(60, 100, 'exit').setScale(0.75, 0.75).setInteractive();
        const errorText = this.add.text(1000, 700, 'Auth error: Please logout and log back in to change password',
        {fontSize: '36px', fontFamily: 'Woodchuck'}).setOrigin(1, 0).setInteractive().setVisible(false);
        errorText.setStroke('#000000', 6);
        const confirmText = this.add.text(500, 600, 'Account updated!',
        {fontSize: '36px', fontFamily: 'Woodchuck'}).setOrigin(1, 0).setInteractive().setVisible(false);
        confirmText.setStroke('#000000', 6);

        Phaser.Display.Align.In.Center(this.bg, this.add.zone(640, 390, 1280, 780));

        this.exit.on('pointerup', function (pointer) {
            console.log("I was clicked!");
            this.scene.start('Profile');
        }, this)

        let firebaseApp = this.plugins.get('FirebasePlugin');
        console.log(firebaseApp.getUser())
        const userEmail = firebaseApp.getUser().email;
        var currUsername = '';

        // get curr username
        const request = ( url, param, method = 'GET' ) => {

            url +=  ( param).toString();        
            return fetch( url ).then( response => response.json() );
        };
        const get = ( url, param ) => request( url, param, 'GET' );

        get('http://localhost:3001/users/findUser/', userEmail)
        .then(response => {
            console.log(response);
            currUsername = response.uname;
        })

        // Add a form to the scene
        const element = this.add.dom(650, 400).createFromCache('editProfileForm');
        element.setPerspective(800);
        element.addListener('click');

        element.on('click', function (event)
        {

            if (event.target.name === 'saveButton')
            {
                var newUsername = this.getChildByName('username');
                var newPassword = this.getChildByName('password');
                var isSuccess = true;

                //modify account in Firebase
                if (newPassword.value !== '') { 
                    firebaseApp.updatePassword(newPassword.value)
                    .then(cred => {
                        console.log(cred);
                    })
                    .catch(function(error) {
                        // Handle Errors here.
                        console.log(error);
                        if (error.code === 'auth/requires-recent-login') {
                            // Display error text to logout
                            errorText.setVisible(true);
                            isSuccess = false;
                        }
                    });
                }
                else {
                    newPassword.value = null;
                }

                if (newUsername.value === '') {
                    newUsername.value = null;
                }

                const userData = JSON.stringify({
                    username: currUsername,
                    email: userEmail,
                    newUsername: newUsername.value,
                    newEmail: null,
                    newPassword: newPassword.value
                });
                console.log(userData);


                const options = {
                    method: 'PUT',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: userData,
                }

                // modify account in DB
                fetch("http://localhost:3001/users/updateAccount",options).then(response =>{
                    console.log(JSON.stringify(response));
                })

                if (isSuccess) {
                    confirmText.setVisible(true);
                }
            }

        });
    }
    
    update() {
        
    }
}