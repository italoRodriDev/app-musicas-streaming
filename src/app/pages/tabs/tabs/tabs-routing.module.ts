import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const userNotAuthorized = () => redirectUnauthorizedTo(['splash']);


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-home',
        loadChildren: () => import('./../tab-home/tab-home.module').then(m => m.TabHomePageModule)
        , canActivate: [AngularFireAuthGuard]
        , data: { userNotAuthorized }
      },
      {
        path: 'tab-library',
        loadChildren: () => import('./../tab-library/tab-library.module').then(m => m.TabLibraryPageModule)
        , canActivate: [AngularFireAuthGuard]
        , data: { userNotAuthorized }
      },
      {
        path: 'tab-profile',
        loadChildren: () => import('./../tab-profile/tab-profile.module').then(m => m.TabProfilePageModule)
        , canActivate: [AngularFireAuthGuard]
        , data: { userNotAuthorized }
      },
      {
        path: '',
        redirectTo: './../tabs/tab-home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: './../tabs/tab-home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
