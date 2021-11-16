import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyhauntooComponent } from './myhauntoo/myhauntoo.component';
import { SummoningComponent } from './summoning/summoning.component';

const routes: Routes = [
  { path: 'myhauntoo', component: MyhauntooComponent },
  { path: 'summoning', component: SummoningComponent },
  { path: '', redirectTo: 'myhauntoo', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HauntooRoutingModule { }
