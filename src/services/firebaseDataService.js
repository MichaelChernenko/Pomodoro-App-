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

  add(data, key) {
    this.db.ref().child('user/tasks/' + key).set(data);
    return this;
  }

  updateData(updates) {
    this.db.ref().update(updates);
  }

  getOnceData(key) {
    return this.db.ref(key).once('value');
  }
}
