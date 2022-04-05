import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AdmArtistPagePageRoutingModule } from './adm-artist-page-routing.module';
import { AdmArtistPagePage } from './adm-artist-page.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmArtistPagePageRoutingModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    LazyLoadImageModule
  ],
  declarations: [AdmArtistPagePage]
})
export class AdmArtistPagePageModule {}
