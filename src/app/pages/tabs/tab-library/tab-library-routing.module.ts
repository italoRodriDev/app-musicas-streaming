import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabLibraryPage } from './tab-library.page';

const routes: Routes = [
  {
    path: '',
    component: TabLibraryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabLibraryPageRoutingModule {}
