import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CreateComponent } from './create/create.component'
import { RouteGuardService } from './role.guard'

const routes: Routes = [
  {
    path: 'search/sale',
    loadChildren: () => import('src/app/search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'search/sire',
    loadChildren: () => import('src/app/search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'search/all',
    loadChildren: () => import('src/app/search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'search',
    loadChildren: () => import('src/app/search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'hauntoo',
    loadChildren: () => import('src/app/hauntoo/hauntoo.module').then(m => m.HauntooModule)
  },
  {
    path: 'create',
    canActivate: [RouteGuardService],
    component: CreateComponent
  },
  { path: '', redirectTo: 'search', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
