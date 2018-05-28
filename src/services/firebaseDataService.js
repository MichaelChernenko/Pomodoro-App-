import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBUegs1ZkcYuV0JAXi4zIh5kGW6ReGFBRU",
  authDomain: "productivity-timer-52c00.firebaseapp.com",
  databaseURL: "https://productivity-timer-52c00.firebaseio.com",
  projectId: "productivity-timer-52c00",
  storageBucket: "productivity-timer-52c00.appspot.com",
  messagingSenderId: "848390793444"
};

let app = firebase.initializeApp(config);

export default class DataService {
  constructor() {
    this.db = app.database();
  }

  add(data, key, user) {
    this.db.ref().child(user + '/tasks/' + key).set(data);
    return this;
  }

  updateData(updates) {
    this.db.ref().update(updates);
  }

  getOnceData(key) {
    return this.db.ref(key).once('value');
  }

  createUser(email, pass) {
    return firebase.auth().createUserWithEmailAndPassword(email, pass)
      .catch(error => {
        return error;
        console.log(error.message, error.code);
      })
  }

  signIn(email, pass) {
    return firebase.auth().signInWithEmailAndPassword(email, pass)
      .catch(error => {
        return error;
        console.log(error.message, error.code);
      })
  }

  signOut() {
    return firebase.auth().signOut();
  }

  observeUserChange(handler) {
    return firebase.auth().onAuthStateChanged(user => {
        handler(user)
    })
  }
}
