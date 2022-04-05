import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaylistMusicPagePage } from './playlist-music-page.page';

const routes: Routes = [
  {
    path: '',
    component: PlaylistMusicPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistMusicPagePageRoutingModule {}
