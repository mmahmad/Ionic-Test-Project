import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { ModalController, ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
// import { SecondPage } from '../../pages/second/second'
import { ModalController, Platform, ViewController } from 'ionic-angular';
import { SecondPage } from '../../pages/second/second';
import { NewNotePage } from '../../pages/new-note/new-note'
import { NoteDetailsPage } from '../../pages/note-details/note-details' 
import { Storage } from '@ionic/storage'; // for retrieving notes from local database
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { Toast } from '@ionic-native/toast';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

//   template: `

//   <ion-header>
//   <ion-navbar>
//     <ion-title>
//       Ionic Blank
//     </ion-title>
//   </ion-navbar>
// </ion-header>

// <ion-content padding>
  

// <ion-fab bottom right>
//   <button ion-fab (tap)="tapEvent($event)" right bottom><ion-icon name="add"></ion-icon></button>
// </ion-fab>


// <ion-list id="notelist" [innerHtml]="htmlToAdd">
  
//   <ion-item>
//     1
//   </ion-item>

//   <ion-item>
//     2
//   </ion-item>

//   <ion-item>
//     3
//   </ion-item>

// </ion-list>


//   `

})
export class HomePage {

	public tap: number = 0;
  private notes: Array<any>;
  public latitude : any;
  public longitude : any;
  public accuracy : any;

  // private titles: Array<string>;
  

  // public notes : Array<string>;

  constructor(public navCtrl: NavController,
   public modalCtrl : ModalController,
   private storage : Storage,
   private androidFingerprintAuth: AndroidFingerprintAuth,
   private toast: Toast,
   private geolocation: Geolocation
    ) {
    this.notes = [];
    // retrieve notes from database

    this.retrieveNotesFromDb();

    // this.titles = [];
    this.authenticate();
    this.getCurrentLocation();

  }


  getCurrentLocation(){

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    // this.geolocation.getCurrentPosition(this.success, this.error, options);


    this.geolocation.getCurrentPosition().then((resp) => {
      // var crd = resp.coords;
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.accuracy = resp.coords.accuracy;

 // resp.coords.latitude
 // resp.coords.longitude
}).catch((error) => {
  console.log('Error getting location', error);
});



  }

  authenticate(){
    this.androidFingerprintAuth.isAvailable()
  .then((result)=> {
    if(result.isAvailable){
      // it is available

      this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword' })
        .then(result => {
           if (result.withFingerprint) {
               console.log('Successfully encrypted credentials.');
               console.log('Encrypted credentials: ' + result.token);

               // Show toast on success
             this.toast.show(`Authentication successful!`, '5000', 'bottom').subscribe(toast => {
              console.log(toast);
            });

           } else if (result.withBackup) {
             console.log('Successfully authenticated with backup password!');

             // Show toast on success
             this.toast.show(`Authentication successful!`, '5000', 'bottom').subscribe(
  toast => {
    console.log(toast);
  }
);

           } else console.log('Didn\'t authenticate!');
        })
        .catch(error => {
           if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
             console.log('Fingerprint authentication cancelled');
           } else console.error(error)
        });

    } else {
      // fingerprint auth isn't available
    }
  })
  .catch(error => console.error(error));
  }

  retrieveNotesFromDb(){

    this.storage.forEach((value, key, iterationNumber) => {
      // console.log("key: " + key + ", value: " + value + ", iterationNumber: " + iterationNumber);

      // console.log("Title: " + value.title + ", Note: " + value.note);


      this.notes.push({noteKey: key, noteTitle : value.title, noteDescription : value.note});
      // var note = JSON.parse(value);
      // console.log(note);

    }).then(() => {console.log("Promise resolved: Iteration finished.")})


  }

  tapEvent(e) {
    this.tap++
    // let myModal = this.modalCtrl.create(SecondPage, characterNum);
    // myModal.present();

    this.openNewNoteModal();

  }

  noteTapped(note){

    // open new page and pass the note to it...

    this.navCtrl.push(NoteDetailsPage, {key:note.noteKey, title: note.noteTitle, note: note.noteDescription});

  }

  deleteNote(note){
    // delete note from database and from the notes array.

    //deleting notes from db...
    this.storage.remove(note.noteKey).then((notes)=>{
      this.notes = notes;
      console.log("Note removed from db.")
    }).catch((error)=>{
      console.log("Unable to remove note from db. " + error)
    });

    // deleting from the array...
    var index = this.notes.indexOf({key:note.noteKey, title: note.noteTitle, note: note.noteDescription});
    if (index > -1) {
    this.notes = this.notes.splice(index, 1);
  }

  }

  openModal(characterNum) {

    let modal = this.modalCtrl.create(SecondPage, characterNum);
    modal.present();
  }

  openNewNoteModal(){

    let newNoteModal = this.modalCtrl.create(NewNotePage);
    newNoteModal.onDidDismiss(receivedData => {
      
      if (receivedData != null){

    var tokens = receivedData.split(":");
    var title = tokens[0]
    var note = tokens[1]

    // console.log("The data received is:\nTitle: " + title + "\nNote: " + note);

    // Now, add note to screen

    // var list = document.getElementById("notelist");
    // var newItem = document.createElement("ion-item");
    // newItem.appendChild(document.createTextNode(title));
    // list.appendChild(newItem);

    // this.titles.push(title);
    this.notes.push({noteKey : 5, noteTitle : title, noteDescription : note}); // NOTE: "notekey" key has been added here to avoid errors. It is a workaround because the actual noteKey is set when saving to the database, not here. The notekey is added here so that the data pushed in the array is in a consistent format, otherwise it throws an error when loading the first screen due to inconsistent array data.
    // this.notes.push(title, note);
}


   });
    newNoteModal.present();

  }

}

@Component({
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      Description
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <ion-list>
      <ion-item>
        <ion-avatar item-start>
          <img src="{{character.image}}">
        </ion-avatar>
        <h2>{{character.name}}</h2>
        <p>{{character.quote}}</p>
      </ion-item>
      <ion-item *ngFor="let item of character['items']">
        {{item.title}}
        <ion-note item-end>
          {{item.note}}
        </ion-note>
      </ion-item>
  </ion-list>
</ion-content>
`
})
export class ModalContentPage {
  character;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    var characters = [
      {
        name: 'Gollum',
        quote: 'Sneaky little hobbitses!',
        image: 'assets/img/avatar-gollum.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'River Folk' },
          { title: 'Alter Ego', note: 'Smeagol' }
        ]
      },
      {
        name: 'Frodo',
        quote: 'Go back, Sam! I\'m going to Mordor alone!',
        image: 'assets/img/avatar-frodo.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Weapon', note: 'Sting' }
        ]
      },
      {
        name: 'Samwise Gamgee',
        quote: 'What we need is a few good taters.',
        image: 'assets/img/avatar-samwise.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Nickname', note: 'Sam' }
        ]
      }
    ];
    this.character = characters[this.params.get('charNum')];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

