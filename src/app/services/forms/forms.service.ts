import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
const EMPTY_REGEX = /(.|\s)*\S(.|\s)*/;

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  readonly searchValidator = ['', [Validators.pattern(EMPTY_REGEX), Validators.minLength(20), Validators.maxLength(200)]];
  readonly nameValidator = ['', [Validators.minLength(3), Validators.maxLength(100), Validators.required]];
  readonly textValidator = ['', [Validators.minLength(3), Validators.maxLength(100), Validators.required]];
  readonly emailValidator = ['', [Validators.email, Validators.minLength(8), Validators.maxLength(100), Validators.required]];
  readonly passValidator = ['', [Validators.minLength(8), Validators.maxLength(30), Validators.required]];
  readonly titleValidator = ['', [Validators.minLength(3), Validators.maxLength(45), Validators.required]];
  readonly descValidator = ['', [Validators.minLength(8), Validators.maxLength(200), Validators.required]];
  readonly numberAddressValidator = ['', [Validators.minLength(1), Validators.maxLength(10), Validators.required]];
  readonly phoneValidator = ['', [Validators.minLength(11), Validators.maxLength(11), Validators.required]];
  readonly formattedAddressValidator = ['', [Validators.minLength(10), Validators.maxLength(300), Validators.required]];
  readonly reqValidator = ['', [Validators.required]];

  // -> Formulario de cadastro
  formAuthSignUp: FormGroup = this.fb.group({
    email: this.emailValidator,
    password: this.passValidator
  });

  // -> Formulario de login
  formAuthSign: FormGroup = this.fb.group({
    email: this.emailValidator,
    password: this.passValidator
  });

  // -> Formulario de recuperacao de senha
  formAuthRecover: FormGroup = this.fb.group({
    email: this.emailValidator
  });


  // -> Formulario de registro de dados do usuario
  public formRegister = this.fb.group({
    name: this.nameValidator,
    email: this.emailValidator,
    type: this.reqValidator,
    idUser: []
  });

  constructor(private fb: FormBuilder) { }

}
