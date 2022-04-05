import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaylistUserPagePage } from './playlist-user-page.page';

const routes: Routes = [
  {
    path: '',
    component: PlaylistUserPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistUserPagePageRoutingModule {}
