import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import { SetFirebaseService } from 'src/app/services/firebase/set-firebase.service';
import { AlertsService } from '../notifications/alerts.service';


@Injectable({
  providedIn: 'root'
})
export class GetFirebaseService {

  db = this.fireDatabase.database;
  idUser = sessionStorage.getItem('user');
  dataUser: any;
  dataUserHistoric: any;
  dataUserAdm: any;
  dataArtist: any;
  dataAlbum: any;
  dataDetail: any;
  dataTypeBest: any;
  genderCategory: string = 'Forró';
  messageTimeDay: any;

  listArtist: Array<any> = [];
  listPlayList: Array<any> = [];
  listAlbums: Array<any> = [];

  listBestsPlayList: Array<any> = [];
  listBestsArtist: Array<any> = [];
  listAlbumsDetail: Array<any> = [];
  listMusicsDetail: Array<any> = [];
  listPlaylistUser: Array<any> = [];
  listMusicUser: Array<any> = [];

  constructor(
    private fireAuth: AngularFireAuth,
    private alertsService: AlertsService,
    private fireDatabase: AngularFireDatabase,
    private navCtrl: NavController,
    private setFireService: SetFirebaseService
  ) {
    this.getCurrentUser();
  }

  // ##################### Recuperando dados lado cliente ##################

  // -> Mostrar Loading
  showLoading() {

    this.alertsService.showLoading('Carregando dados... Por favor Aguarde!').then(loading => {

      loading.present();

      setTimeout(() => {

        loading.dismiss();
      }, 5000);

    });

  }

  // -> Mostrando Saudacao de Horas do Dia
  getMessegeTimeDay() {

    const hour = moment().hour();
    const timeDay = moment().format('a');

    switch (timeDay) {
      case 'am':

        if (hour >= 0 && hour <= 6) {
          this.messageTimeDay = 'Boa Madrugada!';
        } else if (hour >= 6 && hour <= 12) {
          this.messageTimeDay = 'Bom Dia!';
        }
        break;

      case 'pm':

        if (hour >= 12 && hour <= 18) {
          this.messageTimeDay = 'Boa Tarde!';
        } else if (hour >= 18 && hour <= 23) {
          this.messageTimeDay = 'Boa Noite!';
        }
        break;
    }

  }

  // -> Recuperando usuario logado
  getCurrentUser() {

    this.fireAuth.onAuthStateChanged(user => {

      if (user != null) {

        this.getMessegeTimeDay();
        this.getDataUser(user.uid);

      }

    }).catch(() => this.showAlertErrorService());

  }

  // -> Recuperando dados do usuario
  getDataUser(idUser) {

    return new Promise<any>(resolve => {

      this
      .db
      .ref('DataUser')
      .child(idUser)
        .once('value', snapshot => {

          const data = snapshot.val();
          if (data) resolve(data);

        }).catch(() => this.showAlertErrorService());

    }).then(data => {

      sessionStorage.setItem('user', data.idUser);
      
      if (data.type == 'ADMIN') {

        this.dataUserAdm = data;
        this.setFireService.dataUser = data;
        this.navCtrl.navigateForward('menu-admin-page');
      } else {

        this.dataUser = data;
        this.setFireService.dataUser = data;
        this.getArtistInit();
        this.getPlayListInit();
        this.getPlayListUser();  
      }

    });

  }

  /**
   * -> home-page ------------------------ 
   */

  // -> Recuperando artistas iniciais
  getArtistInit() {

    return new Promise<any>(resolve => {

      this.db.ref('StreamingMusic/Artist')
        .limitToFirst(10).once('value', snapshot => {

          const data = snapshot.val();
          if (data) resolve(data);

        }).catch(() => this.showAlertErrorService());

    }).then(data => {

      this.listArtist = Object.keys(data).map(index => data[index]);
      if (this.listArtist.length > 5) {
        this.listArtist.push({ title: 'Mostrar mais', photo: 'assets/images/more_list.jpg', path: 'all-artists-page' });
      }
      this.configListBests(this.listArtist, 'ARTIST');
    });


  }

  // -> Recuperando playlists iniciais
  getPlayListInit() {

    return new Promise<any>(resolve => {

      this.db.ref('StreamingMusic/PlayLists')
        .limitToLast(10).once('value', snapshot => {

          const data = snapshot.val();
          if (data) resolve(data);

        }).catch(() => this.showAlertErrorService());

    }).then(data => {

      this.listPlayList = Object.keys(data).map(index => data[index]);
      if (this.listPlayList.length > 5) {
        this.listPlayList.push({ title: 'Mostrar mais', photo: 'assets/images/more_list.jpg', path: 'all-playlists-page' });
      }
      this.configListBests(this.listPlayList, 'PLAYLIST')
    });


  }

  // -> Recuperando destaques
  configListBests(list, type) {

    switch (type) {
      case 'ARTIST':

        for (let ITEM of list) {

          if (ITEM?.best == true) {

            this.listBestsArtist.push(ITEM);

          }
        }

        if (this.listBestsArtist.length > 5) {
          this.listBestsArtist.push({ title: 'Mostrar mais', photo: 'assets/images/more_list.jpg', path: 'all-artists-page', best: true });
        }
        break;
      case 'PLAYLIST':

        for (let ITEM of list) {

          if (ITEM?.best == true) {

            this.listBestsPlayList.push(ITEM);
          }
        }

        if (this.listBestsPlayList.length > 5) {
          this.listBestsPlayList.push({ title: 'Mostrar mais', photo: 'assets/images/more_list.jpg', path: 'all-playlists-page', best: true });
        }
        break;
    }

  }

  /**
    * playlist-music-page -----------------------------
    */

  // -> Recuperando albums do artista
  getAlbumsArtist(dataArtist) {

    return new Promise<any>(resolve => {

      this.db.ref('StreamingMusic/Album')
        .child(dataArtist.id)
        .once('value', snapshot => {

          const data = snapshot.val();
          if (data) {
            this.listAlbumsDetail = Object.keys(data).map(index => data[index]);
            resolve(this.listAlbumsDetail);
          }
          () => this.showAlertErrorService()
        }).catch(() => this.showAlertErrorService());

    }).then(data => {

      this.getMusicsAlbums(data)
    });

  }

  // -> Recuperando musicas do album do artista
  getMusicsAlbums(listAlbums: Array<any>) {

    while (this.listMusicsDetail.length) this.listMusicsDetail.pop();

    var albums = [];
    var musics = [];

    for (let item of listAlbums) {

      this.db.ref('StreamingMusic/MusicAlbum')
        .child(item.id)
        .once('value', snapshot => {

          const data = snapshot.val();
          if (data) {

            albums.push(Object.keys(data).map(index => data[index]));

            for (let i = 0; i < albums.length; i++) {

              for (let music of albums[i]) {

                musics.push(music);
                
                for (let i of musics) {

                  if (!this.listMusicsDetail.includes(i)) {

                    this.listMusicsDetail.push(i);

                  }
                }
              }
            }
          }
        }).catch(() => this.showAlertErrorService());
    }

  }

  // -> Recuperando musicas da playlist
  getMusicsPlaylist(playlist) {

    while (this.listMusicsDetail.length) this.listMusicsDetail.pop();

    return new Promise<any>(resolve => {

      this.db.ref('StreamingMusic/MusicPlayList').child(playlist.id)
        .once('value', snapshot => {

          const data = snapshot.val();
          if (data) resolve(data);

        }).catch(() => this.showAlertErrorService());


    }).then(data => {

      this.listMusicsDetail = Object.keys(data).map(index => data[index]);

    });

  }

  /**
   * profile-page --------------------------
   */

  // -> Recuperando playlist do usuario
  getPlayListUser() {

    return new Promise<any>(resolve => {

      this.db.ref('StreamingMusic/PlaylistUser')
        .child(this.dataUser.idUser)
        .child('playlist')
        .on('value', snapshot => {

          const data = snapshot.val();
          if (data) resolve(data);

        });

    }).then(data => {

      this.listPlaylistUser = Object.keys(data).map(index => data[index]);

    });


  }

  //-> Recuperando musicas do usuario 
  getListMusicsUser(playlist) {

    this.dataDetail = playlist;

    return new Promise<any>(resolve => {

      this.db.ref('StreamingMusic/MusicsUser')
        .child(this.idUser)
        .child(playlist.id)
        .on('value', snapshot => {

          const data = snapshot.val();
          if (data) {

            resolve(data);
          } else {

            this.alertsService.showAlert('Ops! Você ainda não adicionou músicas a essa playlist.', '');
          }

        });

    }).then(data => {

      this.listMusicUser = Object.keys(data).map(index => data[index]);
      this.navCtrl.navigateForward('playlist-user-page');

    });

  }

  /**
   * player-page --------------------------
   */

  // -> Recuperando albums do artista
  getDataAlbum(artist) {

    this.dataArtist = artist;
    this.getDataHistoricUser();

    return new Promise<any>(resolve => {

      this.db.ref('StreamingAlbum/Album').child(artist.id)
        .once('value', snapshot => {

          const data = snapshot.val();
          if (data) {
            resolve(data);
          } else {
            this.alertsService.showAlert('Ops! Desculpe, mas este artista ainda não possui albúms', '');
          }

        }).catch(() => this.showAlertErrorService());

    }).then(data => {

      this.listAlbums = Object.keys(data).map(index => data[index]);

    });


  }

  // -> Recuperando historico do usuario
  getDataHistoricUser() {

    return new Promise<any>(resolve => {

      this.db.ref('StreamingMusic/UserHistoric')
        .child(this.idUser)
        .once('value', snapshot => {

          const data = snapshot.val();
          if (data) resolve(data);

        }).catch(() => this.showAlertErrorService());

    }).then(data => {

      this.dataUserHistoric = data;

    });

  }

  // ##################### Recuperando dados lado adm ##################

  // -> Mostrando mensagem sem conexão/erro servidor
  showAlertErrorService() {

    this.alertsService.showAlert('Ops! Algo saiu errado.', 'Verifique sua conexão ou tente mais tarde!');

  }
}
