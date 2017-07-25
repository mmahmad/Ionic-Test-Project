import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SecondPage } from '../pages/second/second';
import { ModalContentPage } from '../pages/modal-content/modal-content'
import { NewNotePage } from '../pages/new-note/new-note'
import { NoteDetailsPage} from '../pages/note-details/note-details'
import { IonicStorageModule } from '@ionic/storage';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { Toast } from '@ionic-native/toast';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SecondPage,
    ModalContentPage,
    NewNotePage,
    NoteDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({

      name: '__mydb',
      driverOrder: ['indexeddb','websql','sqlite']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SecondPage,
    ModalContentPage,
    NewNotePage,
    NoteDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AndroidFingerprintAuth,
    Toast
  ]
})
export class AppModule {}
