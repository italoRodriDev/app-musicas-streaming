import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const userNotAuthorized = () => redirectUnauthorizedTo(['splash']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/auth/splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'init-section',
    loadChildren: () => import('./pages/auth/init-section/init-section.module').then(m => m.InitSectionPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'create-account',
    loadChildren: () => import('./pages/auth/create-account/create-account.module').then(m => m.CreateAccountPageModule)
  },
  {
    path: 'recover-account',
    loadChildren: () => import('./pages/auth/recover-account/recover-account.module').then(m => m.RecoverAccountPageModule)
  },
  {
    path: 'terms-service',
    loadChildren: () => import('./pages/auth/terms-service/terms-service.module').then(m => m.TermsServicePageModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs/tabs.module').then(m => m.TabsPageModule)
    , canActivate: [AngularFireAuthGuard]
    , data: { userNotAuthorized }
  },
  {
    path: 'all-musics-page',
    loadChildren: () => import('./pages/client/all-musics-page/all-musics-page.module').then(m => m.AllMusicsPagePageModule)
    , canActivate: [AngularFireAuthGuard]
    , data: { userNotAuthorized }
  },
  {
    path: 'all-artists-page/:id',
    loadChildren: () => import('./pages/client/all-artists-page/all-artists-page.module').then(m => m.AllArtistsPagePageModule)
    , canActivate: [AngularFireAuthGuard]
    , data: { userNotAuthorized }
  },
  {
    path: 'all-playlists-page/:id',
    loadChildren: () => import('./pages/client/all-playlists-page/all-playlists-page.module').then(m => m.AllPlaylistsPagePageModule)
    , canActivate: [AngularFireAuthGuard]
    , data: { userNotAuthorized }
  },
  {
    path: 'playlist-music-page/:id',
    loadChildren: () => import('./pages/client/playlist-music-page/playlist-music-page.module').then(m => m.PlaylistMusicPagePageModule)
    , canActivate: [AngularFireAuthGuard]
    , data: { userNotAuthorized }
  },
  {
    path: 'create-playlist-page',
    loadChildren: () => import('./pages/client/create-playlist-page/create-playlist-page.module').then(m => m.CreatePlaylistPagePageModule)
    , canActivate: [AngularFireAuthGuard]
    , data: { userNotAuthorized }
  },
  {
    path: 'playlist-user-page',
    loadChildren: () => import('./pages/client/playlist-user-page/playlist-user-page.module').then(m => m.PlaylistUserPagePageModule)
    , canActivate: [AngularFireAuthGuard]
    , data: { userNotAuthorized }
  },
  {
    path: 'adm-playlist-page',
    loadChildren: () => import('./pages/admin/adm-playlist-page/adm-playlist-page.module').then(m => m.AdmPlaylistPagePageModule)
    , canActivate: [AngularFireAuthGuard]
    , data: { userNotAuthorized }
  },
  {
    path: 'adm-artist-page',
    loadChildren: () => import('./pages/admin/adm-artist-page/adm-artist-page.module').then(m => m.AdmArtistPagePageModule)
    , canActivate: [AngularFireAuthGuard]
    , data: { userNotAuthorized }
  },
  {
    path: 'menu-admin-page',
    loadChildren: () => import('./pages/admin/menu-admin-page/menu-admin-page.module').then(m => m.MenuAdminPagePageModule)
    , canActivate: [AngularFireAuthGuard]
    , data: { userNotAuthorized }
  },
  {
    path: 'letter-page',
    loadChildren: () => import('./pages/client/letter-page/letter-page.module').then(m => m.LetterPagePageModule)
    , canActivate: [AngularFireAuthGuard]
    , data: { userNotAuthorized }
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
