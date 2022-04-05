import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LetterPagePageRoutingModule } from './letter-page-routing.module';

import { LetterPagePage } from './letter-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LetterPagePageRoutingModule
  ],
  declarations: [LetterPagePage]
})
export class LetterPagePageModule {}
