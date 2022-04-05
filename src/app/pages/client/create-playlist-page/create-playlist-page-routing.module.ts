import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePlaylistPagePage } from './create-playlist-page.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePlaylistPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePlaylistPagePageRoutingModule {}
