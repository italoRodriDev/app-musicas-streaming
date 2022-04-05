import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SharedDirectivesModule } from './../../../directives/shared-directives.module';
import { SharedComponentsModule } from './../../../components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllArtistsPagePageRoutingModule } from './all-artists-page-routing.module';

import { AllArtistsPagePage } from './all-artists-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllArtistsPagePageRoutingModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    LazyLoadImageModule
  ],
  declarations: [AllArtistsPagePage]
})
export class AllArtistsPagePageModule {}
