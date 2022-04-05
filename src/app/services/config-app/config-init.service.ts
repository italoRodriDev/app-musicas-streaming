import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ConfigInitService {

  readonly listSlides: Array<any> = [
    { photo: 'assets/images/logo.png', title: 'As Melhores Séries', sub: 'Todo em um só lugar' },
    { photo: 'assets/images/intro_serie.png', title: 'Os Melhores Filmes', sub: 'Todo em um só lugar' },
    { photo: 'assets/images/intro_serie.png', title: 'Os Principais Lançamentos', sub: 'Todo em um só lugar' }
  ]

  readonly listBottomMenu: Array<any> = [
    { title: 'Artistas', icon: 'create-outline', path: 'adm-artist-page' },
    { title: 'PlayLists', icon: 'create-outline', path: 'adm-playlist-page' },
    { title: 'Cadastro', icon: 'create-outline', path: 'register-user-page' },
    { title: 'Sair', icon: 'exit-outline', path: 'Sair' }
  ];

  readonly listGender: Array<any> = [
    { title: 'Axé', color: 'primary'},
    { title: 'Blues', color: 'primary' },
    { title: 'Country', color: 'primary' },
    { title: 'Eletrônica', color: 'primary' },
    { title: 'Forró', color: 'primary' },
    { title: 'Funk', color: 'primary' },
    { title: 'Gospel', color: 'primary' },
    { title: 'HipHop', color: 'primary' },
    { title: 'Jazz', color: 'primary' },
    { title: 'MPB', color: 'primary' },
    { title: 'Clássica', color: 'primary' },
    { title: 'Pagode', color: 'primary' },
    { title: 'Pop', color: 'primary' },
    { title: 'Rap', color: 'primary' },
    { title: 'Reggae', color: 'primary' },
    { title: 'Rock', color: 'primary' },
    { title: 'Samba', color: 'primary' },
    { title: 'Sertanejo', color: 'primary' }
  ]

  readonly listMenuLinks: Array<any> = [
    { title: 'Lançamentos', path: 'https://suamusica.com.br' },
  ];

  readonly VALID_EMAIL = ['',
    [
      Validators.minLength(8),
      Validators.maxLength(100),
      Validators.required,
      Validators.email
    ]];

  readonly VALID_PASS = ['',
    [
      Validators.minLength(5),
      Validators.maxLength(30),
      Validators.required
    ]];

  readonly VALID_CRED = ['',
    [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.required
    ]];

  readonly VALID_TITLE = ['',
    [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(45)
    ]];

  readonly VALID_TEXT = ['',
    [
      Validators.minLength(8),
      Validators.maxLength(100),
      Validators.required
    ]];

  readonly VALID_DESC = ['',
    [
      Validators.required,
      Validators.minLength(30),
      Validators.maxLength(1000)
    ]];

  readonly VALID_REQ = ['',
    [
      Validators.required
    ]];

  // -> Formulario de login
  public formLogin = this.fb.group({
    email: this.VALID_EMAIL,
    password: this.VALID_PASS
  });

  // -> Formulario de cadastro
  public formRegister = this.fb.group({
    name: this.VALID_TEXT,
    email: this.VALID_EMAIL,
    password: this.VALID_PASS,
    credential: this.VALID_CRED,
    type: this.VALID_REQ,
    idUser: [], photo: [], score: [], tasks: [],
  });

  // -> Formulario recuperar conta
  public formRecover = this.fb.group({
    email: this.VALID_EMAIL
  });

  // -> Formulario de cadastro de playlists
  public formPlayList = this.fb.group({
    title: this.VALID_TITLE,
    description: this.VALID_DESC,
    photo: this.VALID_REQ,
    gender: this.VALID_REQ,
    id: [], type: [], titleSearch: []
  });

  // -> Formulario de cadastro de artistas
  public formArtist = this.fb.group({
    title: this.VALID_TITLE,
    description: this.VALID_DESC,
    gender: this.VALID_REQ,
    classification: this.VALID_REQ,
    year: this.VALID_REQ,
    id: [], photo: [], type: [], titleSearch: []
  });

  // -> Formulario de cadastro de albums
  public formAlbum = this.fb.group({
    photo: this.VALID_REQ,
    title: this.VALID_TITLE,
    description: this.VALID_DESC,
    id: [], gender: []
  });

  // -> Formulario de cadastro de músicas
  public formMusic = this.fb.group({
    title: this.VALID_TITLE,
    letter: this.VALID_REQ,
    id: [], url: [], geder: [], idArtist: [], titleArtist: [], 
    idAlbum: [], titleAlbum: [], titleSearch: [], photo:[],
  });

  constructor(
    public fb: FormBuilder) {
    this.generateColorCards();
    this.getSizeScreen();
  }

  // -> Gerando cores para os cards
  generateColorCards(){

    for(let ITEM of this.listGender){

      ITEM.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      
    }

  }

  // -> Recuperando tamanho da tela
  getSizeScreen() {

    if (screen.width < 640 || screen.height < 480) {

    } else if (screen.width < 1024 || screen.height < 768) {


    } else {

    }

  }


}
