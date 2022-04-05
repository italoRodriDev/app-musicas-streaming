import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInput, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { FormsService } from 'src/app/services/forms/forms.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  @ViewChild('email') inputEmail: IonInput;
  @ViewChild('password') inputPass: IonInput;

  formAuth = this.formService.formAuthSign;
  listChat: Array<any> = [];
  typeForm: string = 'EMAIL';
  disabledSend: boolean = false;
  toggleViewPass: boolean = false;
  isLogged: boolean = false;

  constructor(
    private formService: FormsService,
    private authService: AuthService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private route: Router
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.setInputDisabled(true);
    this.initChat();
  }

  // -> Config mensagem do chat
  sendMsg(msgText, typeUser) {

    return new Promise<void>((resolve) => {

      this.disabledSend = true;
      setTimeout(() => {

        this.listChat.push({ msg: msgText, type: typeUser });
        this.content.scrollToBottom(300);
        resolve();
      }, typeUser === 'BOT' ? 3000 : 300);
    });

  }

  // -> Iniciando chat
  initChat() {

    this.formAuth.reset();
    this.typeForm = 'EMAIL';

    this.sendMsg('Que bom te ver novamente!😊', 'BOT').then(() => {
      this.authService.getCurrentUser().then((res) => {

        if (res === true) {

          this.sendMsg('Verifiquei que você já está conectado.', 'BOT').then(() => {
            this.sendMsg('Sendo assim vamos continuar.', 'BOT').then(() => {
              this.isLogged = true;
            });
          });

        } else {

          this.sendMsg('Informe seu e-mail por gentileza.', 'BOT').then(() => {
            this.setInputDisabled(false);
          });

        }

      });
    });

  }

  // -> Clique em enviar mensagem
  onClickSendMsg() {

    const email = this.formAuth.controls.email.valid;
    const password = this.formAuth.controls.password.valid;

    switch (this.typeForm) {
      case 'EMAIL':
        if (email) {
          this.validateEmail();
        }
        break;
      case 'PASSWORD':
        if (password) {
          this.validatePassword();
        }
        break;
    }

  }

  // -> Validando etapa do e-mail
  validateEmail() {

    const email = this.formAuth.controls.email.value;

    this.sendMsg(email, 'USER').then(() => {
      if (email && email.length >= 8 && email.trim()) {

        this.sendMsg('Agora informe sua senha.', 'BOT').then(() => {
          this.setInputDisabled(false);
          this.typeForm = 'PASSWORD';
        });

      } else {

        this.sendMsg('Informe seu e-mail corretamente por gentileza.', 'BOT').then(() => {
          this.content.scrollToBottom(300).then(() => {
            this.setInputDisabled(false);
          });
        });

      }
    });

  }

  // -> Validando etapa da senha
  validatePassword() {

    const password = this.formAuth.controls.password.value;

    this.sendMsg('✱✱✱✱✱✱✱✱', 'USER').then(() => {
      if (password && password.length >= 8 && password.trim()) {
        this.signUser();
      } else {
        this.sendMsg('Informe sua senha corretamente por gentileza.', 'BOT').then(() => {
          this.content.scrollToBottom(300).then(() => {
            this.setInputDisabled(false);
          });
        });
      }
    });

  }

  // -> Desabilitando input
  setInputDisabled(value) {
    this.disabledSend = value;
    this.inputEmail.disabled = value;
    this.inputPass.disabled = value;
  }

  // -> Cadastrando usuario
  signUser() {

    this.sendMsg('Aguarde um momento.', 'BOT').then(() => {

      this.authService.signUser().then((res) => {

        if (res === true) {

          this.sendMsg('Perfeito! Agora você está conectado na sua conta.', 'BOT').then(() => {
            // -> logado com sucesso
            this.isLogged = true;
          });

        } else {

          switch (res) {
            case 'auth/invalid-email':
              this.sendMsg('Ops! Digite um e-mail válido.', 'BOT').then(() => {
                this.typeForm = 'EMAIL';
                this.setInputDisabled(false);
              });
              break;
            case 'auth/user-disabled':
              this.sendMsg('Ops! Seu acesso foi desativado.', 'BOT').then(() => {
                this.typeForm = 'EMAIL';
                this.setInputDisabled(false);
              });
              break;
            case 'auth/user-not-found':
              this.sendMsg('Ops! Esse e-mail ainda não foi cadastrado.', 'BOT').then(() => {
                this.typeForm = 'EMAIL';
                this.setInputDisabled(false);
              });
              break;
            case 'auth/wrong-password':
              this.sendMsg('Ops! Seu e-mail ou senha não batem. Verifique e tente novamente.', 'BOT').then(() => {
                this.typeForm = 'EMAIL';
                this.setInputDisabled(false);
              });
              break;
            case 'auth/email-not-verified':
              this.sendMsg('Ops! Seu e-mail ainda não foi verificado, enviamos um e-email de verificação para você.', 'BOT').then(() => {
                this.typeForm = 'EMAIL';
                this.setInputDisabled(false);
              });
              break;
            case 'auth/too-many-requests':
              this.sendMsg('Ops! Por excesso de tentativas essa conta foi temporariamente bloqueada. Tente mais tarde.', 'BOT').then(() => {
                this.typeForm = 'EMAIL';
                this.setInputDisabled(false);
              });
              break;
            default: this.sendMsg('Ops! Algo saiu errado. Verifique sua conexão.', 'BOT').then(() => {
              this.typeForm = 'EMAIL';
              this.setInputDisabled(false);
            });
          }

        }

      });

    });

  }

  // -> Clique em continuar
  onClickContinue() {

    if (this.isLogged) {

      this.modalCtrl.dismiss();
      this.navCtrl.navigateForward('/tabs/tab-home');
    }

  }

  // -> Clique em ver senha
  onClickToggleViewPass() {

    this.toggleViewPass === true ? this.toggleViewPass = false : this.toggleViewPass = true;

  }

  // -> Voltar
  onDismiss() {

    this.modalCtrl.dismiss();
  }

}
