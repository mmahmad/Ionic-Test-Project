import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'; // for adding to local database
// import * as localForage from "localforage";

/**
 * Generated class for the NoteDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-note-details',
  template: 
  `

<ion-header>

  <ion-navbar>
    <ion-title>Note Details</ion-title>
  </ion-navbar>

</ion-header>




<ion-content padding>
 
<h1> {{this.title}} </h1>
<br/>
{{this.note}}
<br/>
<button ion-button (tap)="saveToDb()">Save to database</button>

</ion-content>

  `
  // templateUrl: 'note-details.html',
})
export class NoteDetailsPage {

	title: string;
	note : string;



  constructor(public navCtrl: NavController, public navParams: NavParams, private storage : Storage) {

  	// this.note = [];


  	this.title = navParams.get('title');
  	this.note = navParams.get('note');





  	// this.note = navParams.get('userParams');
  	// console.log(this.note);

  }

  // Saves to db after checking that it's ready. Default db config in app.module.ts
  saveToDb(){


  	//when db ready, save to db
  	this.storage.ready().then(() => { 


  		console.log('Resolved, so database is ready. Storing in db...');

  		// Storing
  		// this.storage.set('title', this.title);
  		// this.storage.set('note', this.note);

  		var keyToUse;
  		this.storage.length().then((len) => {
  			console.log("Storage length: " + len);
  			keyToUse = len;
  		});
  		
  		// this.storage.set('' + keyToUse, {'title' : this.title, 'note' : this.note});
  		var note = { "title":this.title, "note":this.note};
  		this.storage.set('' + keyToUse, note);
  		console.log('Saved note to database');

  		// Retrieving
  		console.log(// Or to get a key/value pair
  		this.storage.get('1').then((val) => {
    		console.log('Note:', val);
  			})
  		);


  	}).catch((error) => { console.log('Rejected promise: ' + error + '. DB not ready. Data not stored in db.'); });



// localForage.config({

//   		driver: localForage.WEBSQL,

//   	})


	// this.clearDb();



  }

  clearDb(){

  	this.storage.clear().then(() => {

  	console.log("Database cleared.");

  }).catch((error) => {console.log("DB error when attempting to clear db: " + error)});


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteDetailsPage');
  }

}
