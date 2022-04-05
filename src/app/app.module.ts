import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormBuilder } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { environment } from './../environments/environment.prod';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



@NgModule({
  declarations: [
    AppComponent
  ],

  entryComponents: [

  ],

  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,

  // -> Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
  ],

  providers: [

    // -> Firebase
    AngularFireAuth,
    AngularFireDatabase,
    AngularFireStorage,
    AngularFirestore,

    FormBuilder,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }],
  bootstrap: [AppComponent],
})
export class AppModule { }
