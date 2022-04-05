import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { GetFirebaseService } from 'src/app/services/firebase/get-firebase.service';
import { AlertsService } from 'src/app/services/notifications/alerts.service';

@Component({
  selector: 'app-tab-library',
  templateUrl: './tab-library.page.html',
  styleUrls: ['./tab-library.page.scss'],
})
export class TabLibraryPage implements OnInit {

  idUser = sessionStorage.getItem('user');
  db = this.fireDatabase.database;
  listPlaylist: Array<any> = [];
  listPlaylistFilter: Array<any> = [];
  toggleMovies: boolean = true;
  toggleSeries: boolean = true;
  typeView: string;

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private platform: Platform,
    private navCtrl: NavController,
    private alertsService: AlertsService,
    private fireDatabase: AngularFireDatabase,
    private getFirebaseService: GetFirebaseService
  ) { }

  ngOnInit() {
    this.configInit();
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

  // -> Config iniciais
  configInit() {

    // -> Recuperando id da rota
    this.route.params.subscribe(data => {
      const type = data['id'];

      switch (type) {
        case 'meu-perfil':
          this.typeView = 'Meu Perfil';
          break;
        case 'minha-lista':
          this.typeView = 'Minha Lista';
          break;
      }

    });

  }

  // -> Recuperando dados do servico
  getDataService() {

    setTimeout(() => {

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