import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonInput, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { FormsService } from 'src/app/services/forms/forms.service';
import { TermsServicePage } from '../terms-service/terms-service.page';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  @ViewChild('email') inputEmail: IonInput;
  @ViewChild('password') inputPass: IonInput;


  formAuth: FormGroup = this.formService.formAuthSignUp;
  listChat: Array<any> = [];
  typeForm: string = 'INIT';
  terms: boolean = false;
  disabledSend: boolean = false;
  toggleViewPass: boolean = false;
  toggleBtnContinue: boolean = false;

  constructor(
    private formService: FormsService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private route: Router
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
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

    const email = this.formAuth.controls.email.valid;
    this.formAuth.reset();
    this.typeForm = 'EMAIL';

    if (!email) {

      this.sendMsg('Olá, Tudo bem?😊', 'BOT').then(() => {
        this.sendMsg('Fico feliz em te ver por aqui!😉', 'BOT').then(() => {
          this.sendMsg('Me chamo Italo e vou te ajudar a realizar o seu cadastro.', 'BOT').then(() => {
            this.sendMsg('Primeiro preciso que me informe o seu melhor e-mail.', 'BOT').then(() => {
              this.setInputDisabled(false);
            });
          });
        });
      });

    }

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
    this.typeForm = 'PASSWORD';

    if (email && email.length >= 8 && email.trim()) {

      this.sendMsg(email, 'USER').then(() => {
        this.sendMsg('Agora preciso que crie uma senha de acesso.', 'BOT')
        .then(() => {
          this.sendMsg('A senha precisa ter pelo menos 8 letras ou 8 números.', 'BOT')
          .then(() => {
              this.sendMsg('Exemplo: Luacheia-2022', 'BOT').then(() => {
                this.setInputDisabled(false);
              });
            });
        });
      });

    } else {
      this.sendMsg('Por favor informe um e-mail válido.', 'BOT').then(() => {
        this.content.scrollToBottom(300).then(() => {
          this.setInputDisabled(false);
        });
      });
    }

  }

  // -> Validando etapa da senha
  validatePassword() {

    const password = this.formAuth.controls.password.value;

    if (password && password.length >= 8 && password.trim()) {
        if (this.terms === true) {
          this.registerUser();
        } else {
          this.sendMsg('Você aceita nossos termos de privacidade?', 'BOT').then(() => {
            this.showTerms();
          });
        }
  
    } else {
      this.sendMsg('Você informou uma senha muito pequena, o mínimo é 8 caracteres.', 'BOT').then(() => {
        this.content.scrollToBottom(300).then(() => {
          this.setInputDisabled(false);
        });
      });
    }

  }

  // -> Desabilitando input
  setInputDisabled(value) {
    this.disabledSend = value;
    this.inputEmail.disabled = value;
    this.inputPass.disabled = value;
  }

  // -> Mostrar termos de privacidade
  async showTerms() {

    const modal = await this.modalCtrl.create({
      component: TermsServicePage,
      mode: 'ios'
    });

    modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {

      // -> Recebendo resposta dos termos
      this.terms = data.response;

      if (this.terms) {

        this.sendMsg('Sim, Eu concordo com os temos e politicas da empresa.', 'USER').then(() => {
          this.sendMsg('Agora que ambas as partes estão de acordo, vamos prosseguir.', 'BOT').then(() => {
            this.registerUser();
          });
        });

      } else {

        this.sendMsg('Não, Eu não concordo com os temos e politicas da empresa', 'USER').then(() => {
          this.sendMsg('Sendo assim não podemos prosseguir com o cadastro, Caso mude de ideia volte aqui depois.', 'BOT').then(() => {
            this.toggleBtnContinue = true;
            this.setInputDisabled(true);
          });
        });
      }

    }

  }

  // -> Cadastrando usuario
  registerUser() {

    this.sendMsg('Aguarde um momento.', 'BOT').then(() => {

      // -> Cadastrar usuario
      this.authService.createAccountUser().then((res) => {

        if (res === true) {

          // -> Conta criada com sucesso
          this.sendMsg('Boa notícia! Sua conta foi criada com sucesso.😀', 'BOT').then(() => {
            this.sendMsg('Fique a vontade para continuar.😊😊😊', 'BOT').then(() => {

              this.toggleBtnContinue = true;
              this.setInputDisabled(true);
            });
          });

        } else {

          switch (res) {
            case 'auth/email-already-in-use':

              this.sendMsg('Ops! Este endereço de e-mail já está cadastrado.', 'BOT').then(() => {
                this.typeForm = 'EMAIL';
                this.setInputDisabled(false);
              });
              break;
            case 'auth/invalid-email':

              this.sendMsg('Ops! Por favor defina um e-mail válido.', 'BOT').then(() => {
                this.typeForm = 'EMAIL';
                this.setInputDisabled(false);
              });
              break;
            case 'auth/operation-not-allowed':

              this.sendMsg('Ops! Você não tem permissão para realizar o cadastro.', 'BOT').then(() => {
                this.typeForm = 'EMAIL';
                this.setInputDisabled(false);
              });

              break;
            case 'auth/weak-password':

              this.sendMsg('Ops! Por favor defina uma senha mais forte.', 'BOT').then(() => {
                this.typeForm = 'PASSWORD';
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

    if (this.toggleBtnContinue) {

      this.navCtrl.navigateBack('/tabs/tab-home');
      this.modalCtrl.dismiss();
     
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
