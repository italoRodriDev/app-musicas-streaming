import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup } from '@angular/forms';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { SetFirebaseService } from 'src/app/services/firebase/set-firebase.service';
import { AlertsService } from 'src/app/services/notifications/alerts.service';
import { ConfigInitService } from '../../../services/config-app/config-init.service';

@Component({
  selector: 'app-adm-artist-page',
  templateUrl: './adm-artist-page.page.html',
  styleUrls: ['./adm-artist-page.page.scss'],
})
export class AdmArtistPagePage implements OnInit {

  @ViewChild('inputSelectFile') inputSelectFile;
  @ViewChild('inputSelectAudio') inputSelectAudio;
  @ViewChild('imgArtistPreview') imgArtistPreview;
  @ViewChild('imgAlbumPreview') imgAlbumPreview;

  db = this.fireDatabase.database;
  urlPhotoInput: string = 'assets/images/img_default.jpg';
  segmentPage: number = 1;
  segmentRegister: number = 1;

  formArtist: FormGroup = this.configInitService.formArtist;
  formAlbum: FormGroup = this.configInitService.formAlbum;
  formMusic: FormGroup = this.configInitService.formMusic;

  idArtist: string;
  idAlbum: string;
  idMusic: string;

  // -> Objeto para mostrar os dados do artista e da musica entre telas
  detailArtistEdition: any;
  detailAlbumEdition: any;

  listGender: Array<any> = this.configInitService.listGender;
  listArtist: Array<any> = [];
  listArtistFilter: Array<any> = [];
  listArtistBest: Array<any> = [];
  listAlbum: Array<any> = [];
  listMusic: Array<any> = [];

  modeRegister: boolean = false;
  toggleProgress: boolean = false;
  toggleTypeInputAudio: boolean = false;

  filePhoto: any = [];
  fileAudio: any = [];

  playerPreview: boolean = false;
  player = new Audio();;

  constructor(
    private plataform: Platform,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private alertsService: AlertsService,
    private fireStorage: AngularFireStorage,
    private fireDatabase: AngularFireDatabase,
    private configInitService: ConfigInitService,
    private setFirebaseService: SetFirebaseService
  ) { }

  ngOnInit() {
    this.onBackbutton();
  }

  ionViewDidEnter() {
    this.getListData('Artist');
  }

  // -> Btn voltar plataforma nativa
  onBackbutton() {

    this.plataform.backButton.subscribeWithPriority(10, () => {

      this.navCtrl.back();
      this.player.pause();

    });
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

    const ref = this.db.ref('StreamingMusic/Artist').child(item.id);
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

  // -> Btn modo cadastro/gestao
  toggleModeRegister() {

    this.modeRegister == false
      ? this.modeRegister = true
      : this.modeRegister = false;

  }

  // -> Recuperando dados do servidor
  getListData(reference) {

    // -> Mostrando loading
    this.alertsService.showLoading('Aguarde...')
      .then(loading => {

        switch (reference) {
          // -> Recuperando artistas -------------------------------
          case 'Artist':

            this.db.ref('StreamingMusic').child(reference)
              .on('value', snapshot => {

                const data = snapshot.val();

                if (data) {

                  this.listArtist = Object.keys(data).map(index => data[index]).reverse();
                  this.listArtistFilter = this.listArtist;

                  this.listArtistBest = this.listArtist
                    .filter(filter => filter?.best == true);

                  loading.dismiss();

                } else {

                  if (this.modeRegister == false) {

                    loading.dismiss();
                    this.alertsService.showAlert('Ainda não existem artistas cadastrados!', '');
                  } else {

                    loading.dismiss();
                  }

                }
              });


            break;
          // -> Recuperando albums do artista clicado -----------------------------
          case 'Album':

            this.db.ref('StreamingMusic').child(reference)
              .child(this.idArtist)
              .on('value', snapshot => {

                const data = snapshot.val();

                if (data) {

                  this.segmentPage = 2;
                  this.listAlbum = Object.keys(data).map(index => data[index]);
                  loading.dismiss();

                } else {

                  // -> Se o modo cadastro estiver ativo vai liberar o acesso
                  if (this.modeRegister == false) {

                    this.alertsService.showAlert('Ainda não existem albúms cadastrados para esse artista!', '');
                    loading.dismiss();
                  } else {

                    this.segmentPage = 2;
                    loading.dismiss();
                  }

                }
              });

            // -> Recuperando musica do album clicado -------------------------------
            break;
          case 'MusicAlbum':

            this.db.ref('StreamingMusic').child(reference)
              .child(this.idAlbum)
              .on('value', snapshot => {

                const data = snapshot.val();

                if (data) {

                  this.segmentPage = 3;
                  this.listMusic = Object.keys(data).map(index => data[index]); // -> Montando array
                  loading.dismiss();
                } else {

                  // -> Se o modo cadastro estiver ativo vai liberar o acesso
                  if (this.modeRegister == false) {

                    this.alertsService.showAlert('Ainda não existem música cadastradas para esse albúm!', '');
                    loading.dismiss();
                  } else {

                    this.segmentPage = 3;
                    loading.dismiss();
                  }

                }
              });
            break;
        }

      });

  }

  // -> Recuperando referencia do aquivo para download
  getFile(type) {

    const FORMATS = ['.jpg', '.JPG', '.JPEG', '.png', '.PNG'];

    switch (type) {
      case 'IMG_ARTIST':

        const previewArtist = this.imgArtistPreview.nativeElement;

        let urlFormArtist = this.formArtist.controls.photo.value;
        for (let i of FORMATS) {

          if (urlFormArtist.includes(i)) {
            previewArtist.src = urlFormArtist;

          }

        }
        break;

      case 'IMG_ALBUM':

        const previewAlbum = this.imgAlbumPreview.nativeElement;

        let urlFormAlbum = this.formAlbum.controls.photo.value;

        for (let i of FORMATS) {

          if (urlFormAlbum.includes(i)) {
            previewAlbum.src = urlFormAlbum;

          }

        }
        break;

      case 'AUDIO':

        const readerVideo = new FileReader();

        this.fileAudio = this.inputSelectAudio.nativeElement.files[0];

        return new Promise((resolve) => {

          readerVideo.onload = () => {
            resolve(readerVideo.result);
          }

          readerVideo.onerror = (e) => {
            this.alertsService.showAlert('Ops! Algo Saiu errado', 'Tente novamente...');
          }

          readerVideo.addEventListener('load', function () {

          }, false);

          if (this.fileAudio) {

            readerVideo.readAsDataURL(this.fileAudio);
          }

        });

    }

  }

  // -> Definindo tipo de input do video
  setTypeInput() {

    this.toggleTypeInputAudio == false
      ? this.toggleTypeInputAudio = true
      : this.toggleTypeInputAudio = false;

    if (this.toggleTypeInputAudio == true) {

      this.formMusic.patchValue({ url: 'Url do Google Drive' });
    }
  }

  // -> Validando Formulario -> Edicao -> Validando ID
  btnSaveData(typeForm) {

    const ID_FIRE = this.fireDatabase.createPushId();
    const ID_FORM_ARTIST = this.formArtist.controls.id.value;
    const ID_FORM_ALBUM = this.formAlbum.controls.id.value;
    const ID_FORM_MUSIC = this.formMusic.controls.id.value;

    const FORM_ARTIST = this.formArtist;
    const FORM_ALBUM = this.formAlbum;
    const FORM_MUSIC = this.formMusic;

    const ID_ARTIST = this.detailArtistEdition?.id;
    const TITLE_ARTIST = this.detailArtistEdition?.title;
    const GENDER_ARTIST = this.detailArtistEdition?.gender;
    const TITLE_ALBUM = this.detailAlbumEdition?.title;
    const ID_ALBUM = this.detailAlbumEdition?.id;
    const PHOTO_ALBUM = this.detailAlbumEdition?.photo;

    let titleSearchArtist = this.formArtist.controls.title.value;
    let titleSearchMusic = this.formMusic.controls.title.value;

    // -> Validando tipo de formulario e preenchendo id da edicao
    switch (typeForm) {
      case 'ARTIST':

        if (ID_FORM_ARTIST != null) {

          this.formArtist.patchValue({ titleSearch: titleSearchArtist.toLowerCase() });
          this.setFirebaseService.saveDataDatabase(ID_FORM_ARTIST, FORM_ARTIST, 'Artist');
        } else {

          this.formArtist.patchValue({ id: ID_FIRE, type: 'Artista', titleSearch: titleSearchArtist.toLowerCase() });
          this.setFirebaseService.saveDataDatabase(ID_FIRE, FORM_ARTIST, 'Artist');
        }

        break;
      case 'ALBUM':

        if (ID_FORM_ALBUM != null) {

          this.formAlbum.patchValue({ gender: GENDER_ARTIST });
          this.setFirebaseService.saveDataDatabase(ID_FORM_ALBUM, FORM_ALBUM, 'Album/' + this.idArtist);
        } else {

          this.formAlbum.patchValue({ id: ID_FIRE, gender: GENDER_ARTIST });
          this.setFirebaseService.saveDataDatabase(ID_FIRE, FORM_ALBUM, 'Album/' + this.idArtist);
        }
        break;
      case 'MUSIC':

        // -> Validando se é uma url digitada
        if (this.toggleTypeInputAudio == false) {

          if (ID_FORM_MUSIC != null) {

            this.formMusic.patchValue({ gender: GENDER_ARTIST, idAlbum: ID_ALBUM, titleArtist: TITLE_ARTIST, titleAlbum: TITLE_ALBUM, titleSearch: titleSearchMusic.toLowerCase(), photo: PHOTO_ALBUM });
            this.setFirebaseService.saveDataDatabase(ID_FORM_MUSIC, FORM_MUSIC, 'MusicAlbum/' + this.idAlbum);
          } else {

            this.formMusic.patchValue({ id: ID_FIRE, gender: GENDER_ARTIST, idAlbum: ID_ALBUM, titleArtist: TITLE_ARTIST, titleAlbum: TITLE_ALBUM, titleSearch: titleSearchMusic.toLowerCase(), photo: PHOTO_ALBUM });
            this.setFirebaseService.saveDataDatabase(ID_FIRE, FORM_MUSIC, 'MusicAlbum/' + this.idAlbum);
          }

        } else {

          if (ID_FORM_MUSIC != null) {

            this.formMusic.patchValue({ gender: GENDER_ARTIST, idAlbum: ID_ALBUM, titleArtist: TITLE_ARTIST, titleAlbum: TITLE_ALBUM, titleSearch: titleSearchMusic.toLowerCase(), photo: PHOTO_ALBUM });
            this.setFirebaseService.saveDataDatabase(ID_FORM_MUSIC, FORM_MUSIC, 'MusicAlbum/' + this.idAlbum);
          } else {

            if (this.fileAudio?.name.includes('.mp3')) {

              this.formMusic.patchValue({ id: ID_FIRE, idArtist: ID_ARTIST, titleArtist: TITLE_ARTIST, gender: GENDER_ARTIST, idAlbum: ID_ALBUM, titleAlbum: TITLE_ALBUM, titleSearch: titleSearchMusic.toLowerCase(), photo: PHOTO_ALBUM });
              this.setFirebaseService.uploadSFileStorage(ID_FIRE, FORM_MUSIC, 'MusicAlbum/' + this.idAlbum, this.fileAudio, typeForm);
            } else {

              this.alertsService.showToast('Ops! Selecione uma música.');
            }
          }

        }

        break;
    }

  }

  // -> Filtrando por genero
  filterGender(ev) {

    let value = ev.detail.value;
    this.listArtistFilter = this.listArtist
      .filter(data => data.gender == value
      );

  }

  // -> Filtrando por pesquisa no searchbar
  searchFilter(ev) {

    let value = ev.detail.value;

    if (value && value !== '') {

      this.listArtistFilter = this.listArtist.filter(data =>
        data.title.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
      );

    } else {

      this.listArtistFilter = this.listArtist;
    }

  }

  // -> Resetando formularios
  resetForms() {

    this.formArtist.reset();
    this.formAlbum.reset();
    this.formMusic.reset();
    this.formMusic.patchValue({ url: 'Url do Google Drive' });
  }

  // -> Controlador de edicao de item do card
  btnEditItemCard(type, item) {

    this.segmentRegister = 2;
    switch (type) {
      case 'ARTIST':

        this.formArtist.patchValue({
          id: item.id,
          type: item.type,
          title: item.title,
          titleSearch: item.titleSearch,
          description: item.description,
          photo: item.photo,
          gender: item.gender,
          classification: item.classification,
          year: item.year
        });

        this.getFile('IMG_ARTIST');
        break;
      case 'ALBUM':

        this.formAlbum.patchValue({
          id: item.id,
          photo: item.photo,
          title: item.title,
          description: item.description
        });

        this.getFile('IMG_ALBUM');

        break;
      case 'MUSIC':

        this.formMusic.patchValue({
          id: item.id,
          title: item.title,
          titleSearch: item.titleSearch,
          gender: item.gender,
          url: item.url,
          letter: item.letter
        });
        break;
    }

  }

  // -> Mostrando alerta para remover
  async showAlertRemove(reference, item) {

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
            this.btnRemoveItemCard(reference, item);
          }
        }
      ]
    });

    await alert.present();
  }

  // -> Excluindo itens do database/storage 
  btnRemoveItemCard(type, item) {

    switch (type) {
      case 'ARTIST':

        this.db.ref('StreamingMusic/Artist')
          .child(item.id).remove()
          .then(() => {

            this.db.ref('StreamingMusic/Album')
              .child(item.id).remove()
              .then(() => {

                this.fireStorage.storage.ref('StreamingMusic/Artist')
                  .child(item.id + ".jpeg").delete()
                  .then(() => {

                    this.alertsService.showToast('Artista Removido com sucesso!');

                  });

              });

          });

        break;
      case 'ALBUM':

        this.db.ref('StreamingMusic/Album')
          .child(this.idArtist)
          .child(item.id).remove()
          .then(() => {

            this.alertsService.showToast('Album Removido com sucesso!')
          });

        break;
      case 'MUSIC':

        this.db.ref('StreamingMusic/MusicAlbum')
          .child(this.idAlbum)
          .child(item.id).remove()
          .then(() => {

            this.fireStorage.storage.ref('StreamingMusic/MusicAlbum')
              .child(this.idAlbum)
              .child(item.id + ".mp3").delete()
              .then(() => {

                this.alertsService.showToast('Música Removida com sucesso!');
              });

          });
        break;
    }

  }

  // -> Controlador de visualizacao de sessão
  btnViewSection(type, item) {

    switch (type) {
      case 'VER_ALBUM':

        // -> Passando dados para a outra sessao
        this.detailArtistEdition = item;

        // -> Limpando lista = Se o botao de outo card for clicado
        while (this.listAlbum.length) {
          this.listAlbum.pop();
        }

        this.idArtist = item.id;
        this.getListData('Album');
        break;
      case 'VER_MUSICAS':

        // -> Passando dados para a outra sessao
        this.detailAlbumEdition = item;

        // -> Limpando lista = Se o botao de outo card for clicado
        while (this.listMusic.length) {
          this.listMusic.pop();
        }

        this.idAlbum = item.id;
        this.getListData('MusicAlbum')
        break;
    }

  }

  // -> Preview da musica
  playPreview(type, music) {

    this.player.src = music.url;

    if (this.playerPreview == false && type == 'PLAY') {

      this.playerPreview = true;
      this.player.play();

    } else if (this.playerPreview == true && type == 'PAUSE') {

      this.playerPreview = false;
      this.player.pause();
      this.player.remove();

    }

  }

  // -> Recuperando segmento da pagina
  getSegment(ev) {

    this.segmentPage = ev.detail.value;

  }

  // -> Recuperando segmento de registro
  getSegmentRegister(ev){

    this.segmentRegister = ev.detail.value;

  }

  // -> Btn voltar
  btnBackPage() {

    this.navCtrl.navigateBack('menu-admin-page');
    this.player.pause();
  }

}
