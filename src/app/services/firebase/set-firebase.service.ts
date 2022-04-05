import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/operators';
import { ConfigInitService } from '../config-app/config-init.service';
import { AlertsService } from '../notifications/alerts.service';

@Injectable({
  providedIn: 'root'
})
export class SetFirebaseService {

  dataUser: any;
  db = this.fireDatabase.database;
  st = this.fireStorage.storage;
  uploadProgress: Observable<number>;
  uploadURL: Observable<string>;
  toggleProgress = false;

  formPlayList: FormGroup = this.configInitService.formPlayList;
  formArtist: FormGroup = this.configInitService.formArtist;
  formAlbum: FormGroup = this.configInitService.formAlbum;
  formMusic: FormGroup = this.configInitService.formMusic;

  constructor(
    private configInitService: ConfigInitService,
    private fireDatabase: AngularFireDatabase,
    private fireStorage: AngularFireStorage,
    private alertsService: AlertsService,
    private alertCtrl: AlertController
  ) { }

  // ##################### Salvando dados lado cliente ##################

  /**
   * -> home-page --------------------------- 
   */
  // -> Add aos favoritos
  async addFavorites(movie) {

    const alert = await this.alertCtrl.create({
      header: 'Deseja adicionar a sua lista?',
      subHeader: 'Você pode assistir depois, basta ir até o seu perfil',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => { }
        },
        {
          text: 'Confirmar',
          handler: () => {

            this.db.ref('Streaming/ListUser')
              .child(this.dataUser.idUser)
              .child(movie.id)
              .update(movie)
              .then(() => {

                this.alertsService.showAlert('Adicionado a lista com sucesso!', 'Dê uma passada na sua lista depois!');
              });

          }
        }
      ]
    });
    alert.present();

  }


  /**
   * -> player-page -------------------------
   */

  // -> Salvando progresso do video
  saveProgressSerie(dataSerie, episodeSerie, indexVideo, seasonSerie) {

    let idSerie = dataSerie.id;
    let idEpisode = episodeSerie.id;
    let idSeason = seasonSerie.id;
    let titleSeason = seasonSerie.title;

    if (this.dataUser.idUser != null) {

      // -> Salvando ultimo assistida
      this.db.ref('Streaming/UserHistoric')
        .child(this.dataUser.idUser)
        .child('currentVideo')
        .child(idSerie)
        .update({
          id: idEpisode,
          index: indexVideo,
          idSeason: idSeason,
          titleSeason: titleSeason
        });

      // -> Salvando todos que ja foram assistidos
      this.db.ref('Streaming/UserHistoric')
        .child(this.dataUser.idUser)
        .child('videoProgress')
        .child(idSerie)
        .child(idEpisode)
        .update({
          id: idEpisode,
          index: indexVideo,
          idSeason: idSeason
        });

    }

  }

  // ##################### Salvando dados lado adm ##################

  /**
   * adm-series-page -------------------------------
   */

  // ->  Salvando foto/video no storage
  uploadSFileStorage(id, formData: FormGroup, reference, file, typeForm) {

    let ref = null;

    if(typeForm == 'MUSIC'){
     ref = this.fireStorage.ref(`StreamingMusic/${reference}/${id}.mp3`);
    }else{
     ref = this.fireStorage.ref(`StreamingMusic/${reference}/${id}.jpeg`);   
    }
    
    // -> Validando se existe um arquivo
    if (file.name) {

      this.alertsService.showLoading('Carregando...')
      .then(loading => {

        loading.present();
        const task = ref.put(file);

        this.uploadProgress = task.percentageChanges(); // -> Recuperando porcentagem do upload

        task.snapshotChanges().pipe(finalize(() => { // -> Pós Finalizar upload

          this.uploadURL = ref.getDownloadURL();
          this.uploadURL.subscribe(url => {

            // -> Salvando dados
            if (typeForm == 'ARTIST') {

              this.formArtist.patchValue({ photo: url });
              this.saveDataDatabase(id, formData, reference);
              
            } else if (typeForm == 'ALBUM') {

              this.formAlbum.patchValue({ photo: url });
              this.saveDataDatabase(id, formData, reference);
              
            } else if (typeForm == 'MUSIC') {

              this.formMusic.patchValue({ url: url });
              this.saveDataDatabase(id, formData, reference);
              
            }

            loading.dismiss();
          });

        })).subscribe();

      });

    } else {
      this.alertsService.showAlert('Selecione o aquivo primeiro!', '');
    }

  }

  // -> Salvando registro no database
  saveDataDatabase(id, formData: FormGroup, reference) {

    this.alertsService.showLoading('Carregando...')
      .then(loading => {

        this.db.ref('StreamingMusic')
        .child(reference)
        .child(id)
        .update(formData.value)
        .then(() => {
  
          this.alertsService.showToast('Salvo com sucesso!');
          this.resetForms(); // -> Limpando formulario
          loading.dismiss();
        });

      });

  }

  // -> Resetando formularios
  resetForms() {

    this.formPlayList.reset();
    this.formArtist.reset();
    this.formAlbum.reset();
    this.formMusic.reset();
    this.formMusic.patchValue({ url: 'Url do Google Drive' });
  }
}


