import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemComponent } from '../item/item.component';
import { SearchComponent } from './search.component';

const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'item/:id', component: ItemComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
