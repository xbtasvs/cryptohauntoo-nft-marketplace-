import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HauntooRoutingModule } from './hauntoo-routing.module';
import { MyhauntooComponent } from './myhauntoo/myhauntoo.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SummoningComponent } from './summoning/summoning.component';


@NgModule({
  declarations: [
    MyhauntooComponent,
    SummoningComponent,
  ],
  imports: [
    CommonModule,
    HauntooRoutingModule,
    NgxPaginationModule
  ],
  bootstrap: [MyhauntooComponent]
})
export class HauntooModule { }
