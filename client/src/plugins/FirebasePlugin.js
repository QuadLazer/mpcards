import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore, setDoc, doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, verifyBeforeUpdateEmail, updatePassword, reauthenticateWithCredential, sendPasswordResetEmail, onAuthStateChanged} from 'firebase/auth';
import { getConfig } from './FirebaseConfig';

const firebaseConfig = getConfig();

export default class FirebasePlugin extends Phaser.Plugins.BasePlugin {
    
    constructor(pluginManager) {
        super(pluginManager);

        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
        this.auth = getAuth(app);
        console.log(this.auth);

        this.authStateChangedUnsubscribe = onAuthStateChanged(this.auth, (user) => {
            if (user && this.onLoggedInCallback) {
                this.onLoggedInCallback();
            }
        });

        console.log(this.authStateChangedUnsubscribe);
    }

    destroy() {
        this.authStateChangedUnsubscribe();
        super.destroy();
    }

    onLoggedIn(callback) {
        this.onLoggedInCallback = callback;
    }
    
    async saveGameData(userId, data) {
        await setDoc(doc(this.db, 'game-data', userId), data);
    }

    async loadGameData(userId) {
        const docSnap = await getDoc(doc(this.db, 'game-data', userId));
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    }

    async createUserWithEmailAndPassword(email, password) {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        return userCredential.user;
    }

    async signInWithEmailAndPassword(email, password) {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        return userCredential.user;
    }

    async updateEmail(email) {
        await verifyBeforeUpdateEmail(this.auth.currentUser, email);
    }

    async updatePassword(password) {
        await updatePassword(this.auth.currentUser, password);
    }

    async sendPasswordResetEmail(email) {
        await sendPasswordResetEmail(this.auth, email);
    }

    async reauthenticateWithCredential(email, password) {
        const credential = this.auth.EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(this.auth.currentUser, credential);
    }

    getUser() {
        return this.auth.currentUser;
    }
}