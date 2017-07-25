import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the NewNotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-note',
  templateUrl: 'new-note.html',
  // template:`



  // `
})

export class NewNotePage {
	private todo : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public viewCtrl : ViewController) {

  	this.todo = this.formBuilder.group({
	    title: ['', Validators.compose([Validators.required])],
	    note: [''],

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewNotePage');
  }


  logForm(){


  	console.log("submitted!")
  	this.dismiss();

  }

  dismiss(){
  	var title = this.todo.value.title; // retrieve title from form
  	// console.log("title: ", this.todo.value.title);
  	var note = this.todo.value.note;  // retrieve note from form
  	// console.log("Submitted data", formdata);
  	this.viewCtrl.dismiss(title+":"+note); // dismiss this modal and send the data back to modal caller
  }


}

// export class FormsPage {
//   private todo : FormGroup;

//   constructor( private formBuilder: FormBuilder ) {
//     this.todo = this.formBuilder.group({
//       title: ['', Validators.required],
//       description: [''],
//     });
//   }
//   logForm(){
//     console.log(this.todo.value)
//   }
// }
