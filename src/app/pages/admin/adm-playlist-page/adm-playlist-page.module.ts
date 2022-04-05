import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AdmPlaylistPagePageRoutingModule } from './adm-playlist-page-routing.module';
import { AdmPlaylistPagePage } from './adm-playlist-page.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmPlaylistPagePageRoutingModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    LazyLoadImageModule
  ],
  declarations: [AdmPlaylistPagePage]
})
export class AdmPlaylistPagePageModule {}
