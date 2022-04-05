import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { GetFirebaseService } from 'src/app/services/firebase/get-firebase.service';
import { AlertsService } from 'src/app/services/notifications/alerts.service';

@Component({
  selector: 'app-tab-profile',
  templateUrl: './tab-profile.page.html',
  styleUrls: ['./tab-profile.page.scss'],
})
export class TabProfilePage implements OnInit {

  idUser = sessionStorage.getItem('user');
  db = this.fireDatabase.database;
  dataUser: any;
  listPlaylist: Array<any> = [];
  listPlaylistFilter: Array<any> = [];
  typeView: string;
  toggleMovies: boolean = true;
  toggleSeries: boolean = true;

  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
    private navCtrl: NavController,
    private alertsService: AlertsService,
    private getFirebaseService: GetFirebaseService,
    private fireDatabase: AngularFireDatabase
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.getDataService();
    this.onBackbutton();
  }

  // -> Brn voltar plataforma nativa
  onBackbutton() {

    this.platform.backButton.subscribeWithPriority(10, () => {

      this.navCtrl.back();

    });

  }

  // -> Recuperando dados do servico
  getDataService() {

    setTimeout(() => {

      this.dataUser = this.getFirebaseService.dataUser;
      this.listPlaylist = this.getFirebaseService.listPlaylistUser;
      this.listPlaylistFilter = this.listPlaylist;

    }, 3000);

  }

  // -> Filtrar playlist searchbar
  filterSearchbar(ev) {

    let value = ev.detail.value;

    if (value && value !== '') {

      this.listPlaylistFilter = this.listPlaylist
        .filter(data => data.title.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
        );

    } else {

      this.listPlaylistFilter = this.listPlaylist;
    }

  }

  // -> Click na playlist
  onClickView(item) {

    switch (item.type) {
      case 'Artista':
        this.getFirebaseService.dataDetail = item;
        this.getFirebaseService.getAlbumsArtist(item);
        this.navCtrl.navigateForward(['playlist-music-page', 'biblioteca']);

        break;
      case 'Playlist':
        this.getFirebaseService.dataDetail = item;
        this.getFirebaseService.getMusicsPlaylist(item);
        this.navCtrl.navigateForward(['playlist-music-page', 'biblioteca']);

        break;
      default:
        this.getFirebaseService.dataDetail = item;
        this.getFirebaseService.getListMusicsUser(item);
        break;
    }

  }

  // -> Remover da lista
  async removePlatlist(item) {

    const alert = await this.alertCtrl.create({
      header: 'Tem certeza que deseja remover?',
      subHeader: 'A remoção não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => { }
        },
        {
          text: 'Confirmar',
          handler: () => {

            this.db.ref('StreamingMusic/PlaylistUser')
              .child(this.idUser)
              .child('playlist')
              .child(item.id)
              .remove()
              .then(() => {
                this.alertsService.showAlert('Logo logo a playlist será removida da sua lista!', 'Continue curtindo suas músicas.');
              });

          }
        }
      ]
    });
    alert.present();

  }

}