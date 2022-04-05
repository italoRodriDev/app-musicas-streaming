import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllArtistsPagePage } from './all-artists-page.page';

const routes: Routes = [
  {
    path: '',
    component: AllArtistsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllArtistsPagePageRoutingModule {}
