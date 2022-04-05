import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllMusicsPagePageRoutingModule } from './all-musics-page-routing.module';

import { AllMusicsPagePage } from './all-musics-page.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllMusicsPagePageRoutingModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    LazyLoadImageModule
  ],
  declarations: [AllMusicsPagePage]
})
export class AllMusicsPagePageModule { }
