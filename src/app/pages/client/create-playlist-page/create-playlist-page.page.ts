import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { IonInput, ModalController } from '@ionic/angular';
import { GetFirebaseService } from 'src/app/services/firebase/get-firebase.service';
import { AlertsService } from 'src/app/services/notifications/alerts.service';

@Component({
  selector: 'app-create-playlist-page',
  templateUrl: './create-playlist-page.page.html',
  styleUrls: ['./create-playlist-page.page.scss'],
})
export class CreatePlaylistPagePage implements OnInit {

  @Input() dataDetail;
  @Input() track;
  @Input() listUser;
  @Input() playlist;

  @ViewChild('inputText') inputText: IonInput;

  db = this.fireDatabase.database;
  idUser = sessionStorage.getItem('user');
  toggleOptions: boolean = true;
  listPlaylist: Array<any> = [];

  constructor(
    private alertsService: AlertsService,
    private modalCtrl: ModalController,
    private getFirebaseService: GetFirebaseService,
    private fireDatabase: AngularFireDatabase,
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.getDataService();
  }

  // -> Recuperando dados do servico
  getDataService() {

    setTimeout(() => {

      this.listPlaylist = this.getFirebaseService.listPlaylistUser
      .filter(data => data.type == null);
      
    }, 3000);

  }

  // -> Recuperando opcao escolhida
  getOptionRadio(ev) {

    let value = ev.detail.value;

    switch (value) {
      case 'CRIAR':
        this.toggleOptions = true;
        break;
      case 'EXISTENTE':
        this.toggleOptions = false;
        break;
    }

  }

  // -> Add a playlist e musica a lista do usuario
  async savePlaylist() {

    const id_fire = this.fireDatabase.createPushId();
    const textName: any = this.inputText.value;
    const playlist: any = { id: id_fire, title: textName };

    if (textName.length > 8 && textName !== '') {

      this.db.ref('StreamingMusic/PlaylistUser')
        .child(this.idUser)
        .child('playlist')
        .child(id_fire)
        .update(playlist)
        .then(() => {

          this.inputText.value = '';
          this.alertsService.showAlert('A playlist foi criada com sucesso!', '');
          this.saveMusic(playlist);
        });

    } else {

      this.alertsService.showToast('Digite um nome maior!');
    }

  }

  // -> Salvar musica
  saveMusic(playlist) {

    const music = this.track;

    this.db.ref('StreamingMusic/MusicsUser')
      .child(this.idUser)
      .child(playlist.id)
      .child(music.id)
      .update(music)
      .then(() => {

        this.alertsService.showAlert('A música foi adicionada a sua lista!', this.track.title);
        this.modalCtrl.dismiss();

      });

  }

  // -> Btn voltar
  navigateBackPage() {

    this.modalCtrl.dismiss();

  }

}
