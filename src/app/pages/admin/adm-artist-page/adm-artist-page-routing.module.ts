import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmArtistPagePage } from './adm-artist-page.page';

const routes: Routes = [
  {
    path: '',
    component: AdmArtistPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmArtistPagePageRoutingModule {}
