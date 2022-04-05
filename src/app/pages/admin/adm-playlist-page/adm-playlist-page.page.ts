import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormGroup } from '@angular/forms';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { SetFirebaseService } from 'src/app/services/firebase/set-firebase.service';
import { AlertsService } from 'src/app/services/notifications/alerts.service';
import { ConfigInitService } from '../../../services/config-app/config-init.service';

@Component({
  selector: 'app-adm-playlist-page',
  templateUrl: './adm-playlist-page.page.html',
  styleUrls: ['./adm-playlist-page.page.scss'],
})
export class AdmPlaylistPagePage implements OnInit {

  @ViewChild('inputSelectFile') inputSelectFile;
  @ViewChild('imgPreview') imgPreview;

  db = this.fireDatabase.database;
  formPlayList: FormGroup = this.configInitService.formPlayList;
  urlPhotoInput: string = 'assets/images/img_default.jpg';
  dataPlayListView: any;

  listGender: Array<any> = this.configInitService.listGender;
  listPlayList: Array<any> = [];
  listPlayListFilter: Array<any> = [];
  listPlayListBest: Array<any> = [];
  listMusics: Array<any> = [];
  listMusicsFilter: Array<any> = [];
  listMusicsPlayList: Array<any> = [];

  segmentPage: number = 1;
  segmentRegister: number = 1;
  segmentMusicPlayList: number = 1;
  modeRegister: boolean = false;
  toggleTypeInputVideo: boolean = false;

  constructor(
    private plataform: Platform,
    private navCtrl: NavController,
    private configInitService: ConfigInitService,
    private alertsService: AlertsService,
    private alertCtrl: AlertController,
    private fireDatabase: AngularFireDatabase,
    private setFirebaseService: SetFirebaseService,
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.getPlayLists();
    this.onBackbutton();
  }

  // -> Btn voltar plataforma nativa
  onBackbutton() {

    this.plataform.backButton.subscribeWithPriority(10, () => {

      this.navCtrl.back();

    });

  }

  // -> Recuperando playlists
  getPlayLists() {

    this.db.ref('StreamingMusic/PlayLists')
      .on('value', snapshot => {

        const data = snapshot.val();
        if (data) {

          this.listPlayList = Object.keys(data).map(index => data[index]);
          this.listPlayListFilter = this.listPlayList;

          this.listPlayListBest = this.listPlayList.filter(filter =>
            filter?.best == true
          );

        } else {

          this.alertsService.showAlert('Ainda não existem playlists cadastradas!', '')
        }

      });

  }

  // -> Recuperando musicas da playlist
  getMusicsPlayList(playList) {

    this.db.ref('StreamingMusic/MusicPlayList')
      .child(playList).on('value', snapshot => {

        const data = snapshot.val();
        if (data) {

          this.listMusicsPlayList = Object.keys(data).map(index => data[index]);

        }

      });

  }

  // -> Recuperando todas as músicas
  getAllMusics() {

    return new Promise<any>(resolve => {

      this.db.ref('StreamingMusic/MusicAlbum')
        .orderByChild('gender')
        .once('value', snapshot => {

          const data = snapshot.val();
          if (data) resolve(data);

        });

    }).then(data => {

      let listAlbums = Object.keys(data).map(index => data[index]);
      for (let ALBUM of listAlbums) {

        let listMusics = Object.keys(ALBUM).map(index => ALBUM[index]);
        for (let MUSIC of listMusics) {
          this.listMusics.push(MUSIC);

        }

      }
      this.listMusicsFilter = this.listMusics;

    });

  }

  // -> Filtrar por genero
  filterMusicGender(ev) {

    let value = ev.detail.value;

    this.listMusicsFilter = this.listMusics
      .filter(data => data.gender == value);

  }

  // -> Btn modo cadastro/gestao
  toggleModeRegister() {

    this.modeRegister == false
      ? this.modeRegister = true
      : this.modeRegister = false;

    if (this.modeRegister == true) {

      this.getAllMusics();
    }

  }

  // -> Recuperando file e exibindo previa
  getFile() {

    const preview = this.imgPreview.nativeElement;
    const FORMATS = ['.jpg', '.JPG', '.JPEG', '.png', '.PNG'];
    let urlForm = this.formPlayList.controls.photo.value;

    for (let i of FORMATS) {

      if (urlForm.includes(i)) {
        preview.src = urlForm;

      }

    }

  }

  // -> Mostrando alerta pedindo senha para ativar modo cadastro
  async showAlertConfirmPassword() {

    const alert = await this.alertCtrl.create({
      header: 'Modo Restrito ao Administrador!',
      subHeader: 'Por favor insira a senha!',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Digite a senha',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => { },
        },
        {
          text: 'Continuar',
          handler: (data) => {

            if (data.password === "24102016") {

              this.toggleModeRegister();

            } else {
              this.alertsService.showAlert('Ops! Senha incorreta.', '');
            }
          }
        }
      ]

    });
    alert.present();

  }

  // -> Add aos destaques
  async showAlertAddBest(item) {

    const ref = this.db.ref('StreamingMusic/PlayLists').child(item.id);
    let header: string;
    let subHeader: string;

    if (item.best == null) {

      header = 'Deseja Adicionar aos destaques?';
      subHeader = 'Ao confirmar entra em destaque';

    } else {

      header = "Deseja remover dos destaques?"
      subHeader = "Ao confirmar sai dos destaques";

    }

    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subHeader,
      buttons: [
        { text: 'Cancelar', handler: () => { } },
        {
          text: 'Confirmar', handler: () => {

            if (item?.best == null || false) {

              ref.update({ best: true })
                .then(() => {
                  this.alertsService.showAlert(item.title, 'Foi adicionado aos destaques.');
                });

            } else if (item?.best == true) {

              ref.child('best').remove()
                .then(() => {
                  this.alertsService.showAlert(item.title, 'Foi removido dos destaques.');
                });

            }
          }
        }
      ]
    });
    alert.present();
  }

  // -> Add musica a playlist
  addMusicPlayList(item) {

    const idPlayList = this.dataPlayListView.id;

    this.db.ref('StreamingMusic/MusicPlayList')
      .child(idPlayList).child(item.id)
      .update(item).then(() => {

        this.alertsService.showToast('Ops! Adicionada com sucesso!')

      });

  }

  // -> Filtrando por genero
  filterGender(ev) {

    let value = ev.detail.value;
    this.listPlayListFilter = this.listPlayList
      .filter(data => data.gender == value
      );

  }

  // -> Filtrando por busca no searchbar
  searchFilter(ev, type) {

    let value = ev.detail.value;

    switch (type) {
      case 'PLAYLIST':

        if (value && value !== '') {

          this.listPlayListFilter = this.listPlayList.filter(data =>
            data.title.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
          )

        } else {

          this.listPlayListFilter = this.listPlayList;
        }

        break;
      case 'MUSIC':

        if (value && value !== '') {

          this.listMusicsFilter = this.listMusics.filter(data =>
            data.title.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
          )

        } else {

          this.listMusicsFilter = this.listMusics
        }

        break;
    }

  }

  // -> Editando Filme
  btnEditItemCard(item) {

    this.segmentRegister = 2;

    this.formPlayList.patchValue({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      photo: item.photo,
      gender: item.gender,
      titleSearch: item.titleSearch
    });

    this.getFile();

  }

  // -> Ver Musicas
  btnViewMusics(item) {

    this.dataPlayListView = item;
    this.segmentPage = 2;

    while (this.listMusicsPlayList.length) {
      this.listMusicsPlayList.pop();
    }

    this.getMusicsPlayList(item.id);
  }

  // -> Mostrando alerta para remover
  async showAlertRemove(item, type) {

    const alert = await this.alertCtrl.create({
      header: 'Deseja realmente remover?',
      message: 'Após confimar a remoção não pode ser desfeito!',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            this.alertsService.showToast('Remoção cancelada')
          }
        }, {
          text: 'Continuar',
          handler: () => {
            this.btnRemoveItemCard(item, type);
          }
        }
      ]
    });

    await alert.present();
  }

  // -> Excluindo itens do database/storage 
  btnRemoveItemCard(item, type) {

    const idPlayList = this.dataPlayListView.id;

    switch (type) {
      case 'PLAYLIST':

        this.db.ref('StreamingMusic/PlayLists')
          .child(item.id).remove()
          .then(() => {

            this.alertsService.showToast('PlayList removida com sucesso.');

          });


        break;
      case 'MUSIC':

        this.db.ref('StreamingMusic/MusicPlayList')
          .child(idPlayList)
          .child(item.id).remove()
          .then(() => {

            this.alertsService.showToast('Música removida da playlist com sucesso!');

          });

        break;
    }

  }

  // -> Salvando dados de cadastro
  btnSaveData() {

    const ID_FIRE = this.fireDatabase.createPushId();
    const ID_FORM = this.formPlayList.controls.id.value;
    let titleSearch = this.formPlayList.controls.title.value;

    if (ID_FORM != null) {

      this.formPlayList.patchValue({ titleSearch: titleSearch.toLowerCase() });
      this.setFirebaseService.saveDataDatabase(ID_FORM, this.formPlayList, 'PlayLists');
    } else {

      this.formPlayList.patchValue({ id: ID_FIRE, type: 'Playlist', titleSearch: titleSearch.toLowerCase() });
      this.setFirebaseService.saveDataDatabase(ID_FIRE, this.formPlayList, 'PlayLists');
    }

  }

  // -> Resetando formularios
  resetForms() {

    this.formPlayList.reset();
  }

  // -> Recuperando segmento da pagina
  getSegmentPage(ev, type) {

    switch (type) {
      case 'PAGE_MENU':
        this.segmentPage = ev.detail.value;
        break;
      case 'MUSIC_PLAYLIST':
        this.segmentMusicPlayList = ev.detail.value;
        break;
    }


  }

  // -> Recuperando segmento de registro
  getSegmentRegister(ev){

    this.segmentRegister = ev.detail.value;

  }

  // -> Btn voltar
  btnBackPage() {

    this.navCtrl.back();
  }

}
