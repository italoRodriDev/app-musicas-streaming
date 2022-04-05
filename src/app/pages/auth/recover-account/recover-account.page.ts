import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInput, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { FormsService } from 'src/app/services/forms/forms.service';

@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.page.html',
  styleUrls: ['./recover-account.page.scss'],
})
export class RecoverAccountPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  @ViewChild('email') inputEmail: IonInput;

  formAuth = this.formService.formAuthRecover;
  listChat: Array<any> = [];
  typeForm: string = 'EMAIL';
  disabledSend: boolean = false;
  isLogged: boolean = false;

  constructor(
    private formService: FormsService,
    private authService: AuthService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
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

    this.formAuth.reset();;
    this.typeForm = 'EMAIL';

    this.sendMsg('Olá! Estou aqui para te ajudar.😊', 'BOT').then(() => {
      this.sendMsg('Se você deseja recuperar sua conta vamos continuar.', 'BOT').then(() => {
        this.sendMsg('Informe seu e-mail por gentileza.', 'BOT').then(() => {
          this.setInputDisabled(false);
        });
      });
    });

  }

  // -> Desabilitando input
  setInputDisabled(value) {
    this.disabledSend = value;
    this.inputEmail.disabled = value;
  }

  // -> Clique em enviar mensagem
  onClickSendMsg() {

    const email = this.formAuth.controls.email.valid;

    if (email) {
      this.validateEmail();
    }

  }

  // -> Validando etapa do e-mail
  validateEmail() {

    const email = this.formAuth.controls.email.value;

    if (email && email.length >= 8 && email.trim()) {

      this.sendMsg(email, 'USER').then(() => {
        this.sendMsg('Agora vamos continuar com a recuperação da conta.', 'BOT').then(() => {
          this.sendMsg('Ah! e lembre-se de nunca compartilhar sua senha com ninguém.😉', 'BOT').then(() => {
            this.recoverAccountUser();
          });
        });
      });

    } else {

      this.sendMsg('Informe seu e-mail corretamente por gentileza.', 'BOT').then(() => {
        this.content.scrollToBottom(300).then(() => {
          this.setInputDisabled(false);
        });
      });

    }

  }

  // -> Cadastrando usuario
  recoverAccountUser() {

    this.sendMsg('Aguarde um momento.', 'BOT').then(() => {

      this.authService.recoverAccountUser().then((res) => {

        if (res === true) {

          this.sendMsg('Perfeito! A recuperação da sua conta foi iniciada.', 'BOT').then(() => {
            this.sendMsg('Agora é com você, Verifique seu e-mail.', 'BOT').then(() => {
              this.sendMsg('Geralmente o e-mail chega na caixa de entrada ou em spam.', 'BOT').then(() => {
                this.sendMsg('Abra o e-mail e clique em "Recuperar Conta".', 'BOT').then(() => {
                  this.sendMsg('Depois retorne e tente acessar a conta novamente.', 'BOT').then(() => {
                    this.isLogged = true;
                  });
                });
              });
            });
          });

        } else {

          switch (res) {
            case 'auth/invalid-email':
              this.sendMsg('Ops! Digite seu e-mail corretamente.', 'BOT').then(() => {
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
            default: this.sendMsg('Ops! Algo saiu errado. Verifique sua conexão.', 'BOT').then(() => {
              this.typeForm = 'EMAIL';
              this.setInputDisabled(false);
            });
              break;
          }

        }

      });

    });

  }

  // -> Clique em continuar
  onClickContinue() {
    this.modalCtrl.dismiss();
  }

  // -> Voltar
  onDismiss() {

    this.modalCtrl.dismiss();
  }

}

