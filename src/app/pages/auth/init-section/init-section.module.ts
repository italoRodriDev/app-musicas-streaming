import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InitSectionPageRoutingModule } from './init-section-routing.module';

import { InitSectionPage } from './init-section.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitSectionPageRoutingModule
  ],
  declarations: [InitSectionPage]
})
export class InitSectionPageModule {}
