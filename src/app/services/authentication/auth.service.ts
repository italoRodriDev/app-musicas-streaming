import { AlertsService } from './../notifications/alerts.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { SetFirebaseService } from '../firebase/set-firebase.service';
import { FormsService } from '../forms/forms.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  db = this.fireDatabase.database;
  dataUser: any;
  formAuthLogin: FormGroup = this.formsService.formAuthSign;
  formAuthRegister: FormGroup = this.formsService.formAuthSignUp;
  formRecover: FormGroup = this.formsService.formAuthRecover;
  formRegister: FormGroup = this.formsService.formRegister;
  token: boolean = false;
  idUser: string;

  constructor(
    private formsService: FormsService,
    private fireAuth: AngularFireAuth,
    private fireDatabase: AngularFireDatabase,
    private navCtrl: NavController,
    private alertService: AlertsService
  ) { }

  // -> Recuperando usuario atual
  getCurrentUser() {

    return new Promise<boolean>((resolve) => {

      this.fireAuth.onAuthStateChanged((user) => {

        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }

      });

    });

  }

  // -> Logando usuario com email e senha
  signUser() {

    const email = this.formAuthLogin.controls.email.value;
    const password = this.formAuthLogin.controls.password.value;

    return new Promise<any>((resolve) => {

      this.fireAuth.setPersistence('local')
        .then(() => {

          this.fireAuth.signInWithEmailAndPassword(email, password)
            .then((res) => {

              resolve(true);

            }).catch((error) => resolve(error.code));

        }).catch((error) => resolve(error.code));

    });

  }

  // -> Criando conta do usuario
  createAccountUser() {

    const email = this.formAuthRegister.controls.email.value;
    const password = this.formAuthRegister.controls.password.value;

    return new Promise<any>((resolve) => {

      this.fireAuth.createUserWithEmailAndPassword(email, password)
        .then((res) => {

          const idUser = res.user.uid;

          this.formRegister.patchValue({ 
            idUser: idUser, 
            email: email,
            type: 'CLIENT' 
          });

          this
          .db
          .ref('DataUser')
          .child(idUser)
          .update(this.formRegister.value)
          .then(() => {

            resolve(true);
          }).catch((error) => {
            resolve(false);
          });

        }).catch((error) => resolve(error.code));

    });

  }

  // -> Recuperando conta
  recoverAccountUser() {

    const email = this.formRecover.controls.email.value;

    return new Promise<any>((resolve) => {

      this.fireAuth.sendPasswordResetEmail(email)
        .then(() => {

          resolve(true);

        }).catch((error) => {

          resolve(error.code);

        });

    });

  }

  // -> Sair da conta
  singOutAccount() {

    this.fireAuth.signOut().then(() => {
      this.navCtrl.navigateBack('init-section');
    });

  }

}
