import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllPlaylistsPagePage } from './all-playlists-page.page';

const routes: Routes = [
  {
    path: '',
    component: AllPlaylistsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllPlaylistsPagePageRoutingModule {}
